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
        </head>
        <body>
            <h1>Hello, ${name}!</h1>
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
