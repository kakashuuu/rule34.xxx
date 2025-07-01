import axios from "axios";

const totalApiPages = (pid) => Math.floor(pid / 100) + 1;

export default async function handler(req, res) {
  const gay_block = req.query.gay_block === "true";
  const pages = totalApiPages(168000);
  const random = Math.floor(Math.random() * pages);

  const { data } = await axios.get(
    `https://api.rule34.xxx/index.php?page=dapi&s=post&pid=${random}&q=index&json=1`
  );

  let ray = data.map((obj) => obj.file_url);

  if (gay_block) {
    const block = [
      "male", "gay", "trap", "yaoi", "balls", "dick", "boy",
      "furry", "bovid", "demon", "dog", "penis"
    ];
    const urlSet = new Set();
    data.forEach((obj) => {
      if (block.some((tag) => obj.tags.includes(tag))) {
        urlSet.add(obj.file_url);
      }
    });
    ray = ray.filter((url) => !urlSet.has(url));
  }

  res.status(200).json({ status: 200, result: ray });
}
