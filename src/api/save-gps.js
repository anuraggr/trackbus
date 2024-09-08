import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { lat, lon, bus_id, acc } = req.query;

    if (!lat || !lon || !bus_id || !acc) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Path to the JSON file (relative to Vercel's deployment)
    const jsonFilePath = path.join(process.cwd(), 'data', 'busCoordinates.json');

    let data;
    try {
      const fileContents = await fs.readFile(jsonFilePath, 'utf8');
      data = JSON.parse(fileContents);
    } catch (error) {
      data = {};
    }

    // Update the bus data
    data[bus_id] = {
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      accuracy: parseFloat(acc)
    };

    // Save the updated data back to the file
    try {
      await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
      return res.status(200).json({ message: 'GPS data saved successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to write data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
