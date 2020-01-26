const chromium = require('chrome-aws-lambda');

exports.handler = async (event, ctx) => {
    const { queryStringParameters = {} } = event
    const { name = 'Chewie' } = queryStringParameters;
    
    const HTML = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Generated PDF</title>
            <style>
                body {
                    line-height: 1.6;
                    font-size: 15px;
                    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Oxygen-Sans,Ubuntu,Cantarell,sans-serif;
                    font-weight: 300;
                    background-color: #D33257;
                }
    
                h1, p{
                    color: #fff;
                }
    
            </style>
        </head>
        <body>
            <h1>Hello, ${name}!</h1>
            <p>This is a dynamically generated PDF, just for you.</p>
            <img src="https://i.imgur.com/9SPry9r.png"/>
        </body>
    </html>
    `

    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    })
    const page = await browser.newPage()
    await page.setContent(HTML)
    const pdf = await page.pdf({format: 'A4'})
    await browser.close()
  
    return {
        statusCode: 200,
        isBase64Encoded: true,
        headers: {
          "Content-type": "application/pdf"
        },
        body: pdf.toString("base64")
      }
}
