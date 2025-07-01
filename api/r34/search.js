import axios from "axios";

const totalApiPages = (pid) => Math.floor(pid / 100) + 1;

const apiPid = async (search_tag) => {
  const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&tags=${search_tag}&pid=0&q=index&json=1`;
  const { data } = await axios.get(url);
  return data.length > 0 ? 1000 : 0;
};

export default async function handler(req, res) {
  const { search_tag, block_tags } = req.query;
  if (!search_tag || search_tag.length === 0) {
    return res.status(400).json({ status: 400, message: "search_tag is required" });
  }

  const pid = await apiPid(search_tag);
  if (pid === 0) {
    return res.status(400).json({ status: 400, message: "No results found" });
  }

  const pages = totalApiPages(pid);
  const randomPid = Math.floor(Math.random() * pages);

  const { data } = await axios.get(
    `https://api.rule34.xxx/index.php?page=dapi&s=post&tags=${search_tag}&pid=${randomPid}&q=index&json=1`
  );

  let ray = data.map((obj) => obj.file_url);

  if (block_tags) {
    const blockArray = Array.isArray(block_tags) ? block_tags : [block_tags];
    const urlSet = new Set();
    data.forEach((obj) => {
      if (blockArray.some((tag) => obj.tags.includes(tag))) {
        urlSet.add(obj.file_url);
      }
    });
    ray = ray.filter((url) => !urlSet.has(url));
  }

  res.status(200).json({ status: 200, result: ray });
}
