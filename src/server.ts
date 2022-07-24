import express, {Router, Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const imageUrl: string = req.query.image_url

    if (!imageUrl){
      return res.status(400).send({ message: 'Image URL is missing.' });
    }
    
    const imageUrlRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpeg|jpg|gif|png|svg)/

    if (!(imageUrl.match(imageUrlRegex))){
      return res.status(400).send({ message: 'Invalid Image Url' });
    }

    try {
      const result = await filterImageFromURL(imageUrl)  

      res.status(200).sendFile(result, async() => {
        await deleteLocalFiles([result])
        console.log('Image Filter is processed.')
      })
      
    } catch (err){
        res.status(400).send({message: "Failed to filter the image"})
    }

  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();