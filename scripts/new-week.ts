// Usage: quarto run scripts/new-week.ts <week> "<topic>"
const [weekArg, ...topicParts] = Deno.args;
const n = parseInt(weekArg ?? "");
if (isNaN(n)) {
  console.error('Error: please give a week number, e.g.\n  quarto run scripts/new-week.ts 5 "Discrete random variables"');
  Deno.exit(1);
}
const wk = String(n).padStart(2, "0");
const topic = topicParts.join(" ") || "TBC";
const dir = `weeks/wk${wk}`;
await Deno.mkdir(dir, { recursive: true });

for (const part of ["lecture", "advanced", "sgta", "practical"]) {
  const target = `${dir}/wk${wk}-${part}.qmd`;
  try {
    await Deno.stat(target);
    console.log(`skip    ${target} (already exists)`);
    continue;
  } catch { /* doesn't exist: create it */ }
  const tpl = await Deno.readTextFile(`templates/${part}.qmd`);
  const out = tpl
    .replaceAll("__WEEK__", String(n))
    .replaceAll("__WK__", wk)
    .replaceAll("__PREV__", String(Math.max(n - 1, 0)))
    .replaceAll("__TOPIC__", topic);
  await Deno.writeTextFile(target, out);
  console.log(`created ${target}`);
}