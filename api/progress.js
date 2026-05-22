export default async function handler(req, res) {
  try {
    const NOTION_KEY = process.env.NOTION_KEY;
    const DATABASE_ID = process.env.DATABASE_ID;

    if (!DATABASE_ID) return res.status(400).json({ error: 'Missing database_id' });
    if (!NOTION_KEY) return res.status(400).json({ error: 'Missing notion_key' });

    const response = await fetch('https://api.notion.com/v1/databases/' + DATABASE_ID + '/query', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + NOTION_KEY,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    const data = await response.json();

    if (!response.ok) return res.status(400).json({ error: data.message || 'Notion API error' });

    const pages = data.results || [];
    const total = pages.length;
    let done = 0;
    for (let i = 0; i < pages.length; i++) {
      const props = pages[i].properties;
      if (props && props['달성여부'] && props['달성여부'].checkbox === true) {
        done++;
      }
    }
    const percent = total === 0 ? 0 : Math.round(done / total * 100);

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ total, done, percent });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
