const Morali = require("moralis").default;
const fs = require("fs");
require("dotenv").config();
const cors = require('cors');

//standard von Moralis für selbstständigen Upload
//soll nun um Upload erweitert werden
/*
const fileUploads = [
    {
        path: "",
        content: fs.readFileSync("./", {encoding: "base64"})
    }
]

async function uploadToIpfs(){

    await Moralis.start({
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU2N2JiMWRmLWNkZjktNDU1OS1hZDFjLTRjYTIxNDkzZjQ0YiIsIm9yZ0lkIjoiMzU5MTQwIiwidXNlcklkIjoiMzY5MDk3IiwidHlwZUlkIjoiYjZhOGNiMjYtMDNiOC00ZGJkLTljZDMtNjk0YTE3MDIyZGU4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTU5NzIwMTgsImV4cCI6NDg1MTczMjAxOH0.r1_76F07nsbUFxAoEBHv446YL3z2rw5h3c-ASG3gKto"
    })

    const res = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: fileUploads
    })

    console.log(res.result)
}
*/



const app = express();
const port = 5050;
app.use(cors());
app.use(bodyParser.json());

Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU2N2JiMWRmLWNkZjktNDU1OS1hZDFjLTRjYTIxNDkzZjQ0YiIsIm9yZ0lkIjoiMzU5MTQwIiwidXNlcklkIjoiMzY5MDk3IiwidHlwZUlkIjoiYjZhOGNiMjYtMDNiOC00ZGJkLTljZDMtNjk0YTE3MDIyZGU4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTU5NzIwMTgsImV4cCI6NDg1MTczMjAxOH0.r1_76F07nsbUFxAoEBHv446YL3z2rw5h3c-ASG3gKto"
});

app.post("/upload", upload.single("pdf"), async (req, res) => {
        //Hochgeladene Pdf-Datei lesen
        const filePath = req.file.path;
        const content = fs.readFileSync("./", { encoding: "base64" });

        const fileUploads = [
            {
                path: filePath,
                content: content
            }]
    
    // auf IPFS hochladen
    const response = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: fileUploads
    })
    console.log(response.result);
    
});