export default async function handler(req, res) {
  const NOTION_KEY = process.env.NOTION_KEY;
  const DATABASE_ID = process.env.DATABASE_ID;
  const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
  const data = await response.json();
  const pages = data.results;
  const total = pages.length;
  const done = pages.filter(p => p.properties['달성여부']?.checkbox === true).length;
  const percent = total===0 ? 0 : Math.round(done/total*100);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ total, done, percent });
}
