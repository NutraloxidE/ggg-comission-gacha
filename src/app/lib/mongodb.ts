import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('環境変数MONGODB_URIが設定されていません')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // 開発環境ではグローバル変数を使用
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }
  
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // 本番環境では新しいインスタンスを作成
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise