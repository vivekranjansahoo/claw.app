const { listCollections, getCollectionSchema } = require('../utils/common/collections'); // Import collection utility functions

async function getCollections(req, res){
  try {
    const collections = await listCollections();
    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

async function getData(req, res){
    const collectionName = req.params.collectionName;
    try {
      const data = await getCollectionSchema(collectionName);
      if (!data) {
        return res.status(404).json({ message: `Collection '${collectionName}' not found or has no data` });
      }
      res.json(data);
    } catch (error) {
      console.error('Error fetching schema:', error);
      res.status(500).json({ message: 'Server error' });
    }
};


  
module.exports = {
  getCollections,
  getData
}