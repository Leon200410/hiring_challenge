insert into public.novels (
  slug,
  title,
  author,
  summary,
  cover_path,
  reading_minutes
) values (
  'midnight-library',
  '午夜图书馆',
  '匿名',
  '在一座只在午夜出现的图书馆里，你只能翻开一本书。你选择了那本最不起眼的旧笔记本 —— 里面写满了你遗忘的记忆，而最后一页，是空白的。',
  '/covers/midnight-library.png',
  6
) on conflict (slug) do update set
  title = excluded.title,
  author = excluded.author,
  summary = excluded.summary,
  cover_path = excluded.cover_path,
  reading_minutes = excluded.reading_minutes,
  updated_at = now();

with selected_novel as (
  select id from public.novels where slug = 'midnight-library'
)
insert into public.scenes (novel_id, position, title, body)
select selected_novel.id, scene.position, scene.title, scene.body
from selected_novel
cross join (
  values
    (
      1,
      '午夜',
      '你推开那扇不应该存在的门。

图书馆的穹顶高得看不到尽头，书架像森林一样向四面八方延伸。空气中飘着旧纸和檀香的味道。

一位白发老人坐在前台，抬头看了你一眼：

你来了。每个人一生只能来一次。'
    ),
    (
      2,
      '三本书',
      '老人指向三个方向。

左边，一本发着微光的金色封面的书。右边，一本封面全黑、没有书名的书。中间，一本看起来很普通的旧笔记本。

你可以打开三本书中的一本 —— 但只能读一本。

你走向了中间那本旧笔记本。'
    ),
    (
      3,
      '记忆',
      '你翻开旧笔记本，第一页写着你的名字。

后面的每一页都是一段你遗忘的记忆 —— 七岁时丢失的那个下午，十五岁没说出口的那句话，去年在雨中错过的那个人。

最后一页是空白的，旁边放着一支笔。'
    ),
    (
      4,
      '落笔',
      '你拿起笔，在最后一页写下了一行字。

你写的不是愿望，而是一个约定 —— 和那个雨中错过的人，在同一个路口，再见一面。

合上笔记本的瞬间，图书馆开始消融。书架变成了街道，穹顶变成了天空。'
    ),
    (
      5,
      '重逢',
      '你站在一个路口。天开始下雨了。

远处，有一个撑伞的人正在向你走来。

你知道，这一次你不会错过。'
    )
) as scene(position, title, body)
on conflict (novel_id, position) do update set
  title = excluded.title,
  body = excluded.body,
  updated_at = now();
