import { Client, Databases } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const buildingDatabaseID = process.env.BUILDING_DATABASE_ID;
  const sensorCollectionID = process.env.SENSOR_COLLECTION_ID;

  const databases = new Databases(client);
  try {
    const sensor = await databases.listDocuments(
      buildingDatabaseID,
      sensorCollectionID
    );

    sensor.documents.forEach((document) => {
      insertValue(document.$id);
    });
  } catch (e) {
    log('Get sensor error:' + e);
  }

  const insertValue = (sensorId) => {
    setInterval(async () => {
      const rDValue = Math.floor(Math.random() * 100) + 1;
      try {
        await databases.updateDocument(
          buildingDatabaseID,
          sensorCollectionID,
          sensorId,
          {
            value: rDValue,
          }
        );
        log('Document updated successfully');
      } catch (e) {
        log('Update sensor error:' + e);
      }
    }, 1000); // Interval set to 1000ms (1 second)
  };

  return res.json();
};
