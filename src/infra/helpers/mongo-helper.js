const { MongoClient } = require('mongodb')

module.exports = {
  async connect (uri) {
    this.client = await MongoClient.connect(uri)
    this.db = this.client.db()
  },

  getCollection (collectionName) {
    return this.db.collection(collectionName)
  },

  async disconnect () {
    await this.client.close()
  }
}
