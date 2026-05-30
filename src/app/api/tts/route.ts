import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const DOUBAO_TTS_ENDPOINT =
  "https://openspeech.bytedance.com/api/v3/tts/unidirectional";
const DEFAULT_RESOURCE_ID = "volc.service_type.10029";
const DEFAULT_SPEAKER = "zh_female_sajiaonvyou_moon_bigtts";
const DEFAULT_SAMPLE_RATE = 24000;
const MAX_TEXT_LENGTH = 4000;

type TtsRequest = {
  text?: unknown;
};

type DoubaoTtsFrame = {
  code?: number;
  message?: string;
  data?: string;
};

type DoubaoConfig = {
  authType: string;
  endpoint: string;
  headers: Record<string, string>;
  resourceId: string;
  sampleRate: number;
  speaker: string;
};

function readEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }

  return "";
}

function getDoubaoConfigs(): DoubaoConfig[] {
  const apiKey = readEnv(
    "DOUBAO_API_KEY",
    "VOLCENGINE_TTS_API_KEY",
  );
  const appId = readEnv(
    "DOUBAO_TTS_APP_ID",
    "DOUBAO_TTS_APPID",
    "VOLCENGINE_TTS_APP_ID",
    "VOLCENGINE_TTS_APPID",
  );
  const accessKey = readEnv(
    "DOUBAO_TTS_ACCESS_KEY",
    "DOUBAO_TTS_ACCESS_TOKEN",
    "VOLCENGINE_TTS_ACCESS_KEY",
    "VOLCENGINE_TTS_ACCESS_TOKEN",
    "VOLC_TTS_ACCESS_TOKEN",
  );
  const resourceId =
    readEnv("DOUBAO_TTS_RESOURCE_ID", "VOLCENGINE_TTS_RESOURCE_ID") ||
    DEFAULT_RESOURCE_ID;
  const speaker =
    readEnv("DOUBAO_TTS_SPEAKER", "DOUBAO_TTS_VOICE", "VOLCENGINE_TTS_SPEAKER") ||
    DEFAULT_SPEAKER;
  const sampleRate = Number(
    readEnv("DOUBAO_TTS_SAMPLE_RATE", "VOLCENGINE_TTS_SAMPLE_RATE"),
  );
  const endpoint =
    readEnv("DOUBAO_TTS_ENDPOINT", "VOLCENGINE_TTS_ENDPOINT") ||
    DOUBAO_TTS_ENDPOINT;
  const baseConfig = {
    endpoint,
    resourceId,
    sampleRate: Number.isFinite(sampleRate) && sampleRate > 0 ? sampleRate : DEFAULT_SAMPLE_RATE,
    speaker,
  };
  const configs: DoubaoConfig[] = [];
  const createHeaders = () => ({
    "Content-Type": "application/json",
    "X-Api-Request-Id": randomUUID(),
    "X-Api-Resource-Id": resourceId,
  });

  if (apiKey) {
    configs.push({
      ...baseConfig,
      authType: "api-key",
      headers: {
        ...createHeaders(),
        "X-Api-Key": apiKey,
      },
    });
  }

  if (appId && accessKey) {
    configs.push({
      ...baseConfig,
      authType: "app-access-key",
      headers: {
        ...createHeaders(),
        "X-Api-App-Id": appId,
        "X-Api-Access-Key": accessKey,
      },
    });
  }

  return configs;
}

function appendFrameAudio(frame: DoubaoTtsFrame, audioChunks: Buffer[]) {
  if (typeof frame.code === "number" && frame.code !== 0 && frame.code !== 20000000) {
    throw new Error(frame.message || `Doubao TTS failed with code ${frame.code}`);
  }

  if (frame.data) {
    audioChunks.push(Buffer.from(frame.data, "base64"));
  }
}

function consumeJsonFrames(
  input: string,
  onFrame: (frame: DoubaoTtsFrame) => void,
) {
  let start = -1;
  let depth = 0;
  let inString = false;
  let isEscaped = false;
  let lastEnd = 0;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (start === -1) {
      if (char === "{") {
        start = index;
        depth = 1;
        inString = false;
        isEscaped = false;
      }

      continue;
    }

    if (isEscaped) {
      isEscaped = false;
      continue;
    }

    if (char === "\\") {
      isEscaped = inString;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      depth += 1;
    }

    if (char === "}") {
      depth -= 1;
    }

    if (depth === 0) {
      const frameText = input.slice(start, index + 1);
      onFrame(JSON.parse(frameText) as DoubaoTtsFrame);
      start = -1;
      lastEnd = index + 1;
    }
  }

  return start === -1 ? input.slice(lastEnd) : input.slice(start);
}

async function readDoubaoAudio(response: Response) {
  const audioChunks: Buffer[] = [];
  const decoder = new TextDecoder();
  let pendingText = "";

  if (!response.body) {
    appendFrameAudio((await response.json()) as DoubaoTtsFrame, audioChunks);
  } else {
    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      pendingText += decoder.decode(value, { stream: true });
      pendingText = consumeJsonFrames(pendingText, (frame) =>
        appendFrameAudio(frame, audioChunks),
      );
    }

    pendingText += decoder.decode();
    const remainder = consumeJsonFrames(pendingText, (frame) =>
      appendFrameAudio(frame, audioChunks),
    ).trim();

    if (remainder) {
      throw new Error("Doubao TTS returned an incomplete response frame.");
    }
  }

  if (audioChunks.length === 0) {
    throw new Error("Doubao TTS returned no audio data.");
  }

  return Buffer.concat(audioChunks);
}

async function synthesizeWithDoubao(text: string, config: DoubaoConfig) {
  const response = await fetch(config.endpoint, {
    body: JSON.stringify({
      user: {
        uid: "echo-leaf-reader",
      },
      req_params: {
        text,
        speaker: config.speaker,
        audio_params: {
          format: "mp3",
          sample_rate: config.sampleRate,
        },
      },
    }),
    headers: config.headers,
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Doubao TTS HTTP ${response.status}: ${errorText || response.statusText}`,
    );
  }

  return readDoubaoAudio(response);
}

export async function POST(request: NextRequest) {
  let body: TtsRequest;

  try {
    body = (await request.json()) as TtsRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!text) {
    return Response.json({ error: "Missing text." }, { status: 400 });
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return Response.json(
      { error: `Text is too long. Max length is ${MAX_TEXT_LENGTH} characters.` },
      { status: 413 },
    );
  }

  const configs = getDoubaoConfigs();

  if (configs.length === 0) {
    return Response.json(
      { error: "Doubao TTS is not configured." },
      { status: 500 },
    );
  }

  const errors: string[] = [];

  for (const config of configs) {
    try {
      const audioData = await synthesizeWithDoubao(text, config);

      return new Response(audioData, {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "audio/mpeg",
          "X-Doubao-Auth-Type": config.authType,
          "X-Doubao-Resource-Id": config.resourceId,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${config.authType}: ${message}`);
      console.warn(`Doubao TTS failed with ${config.authType}`, error);
    }
  }

  console.error("Doubao TTS failed", errors);

  return Response.json(
    { error: "Doubao TTS synthesis failed." },
    { status: 502 },
  );
}
