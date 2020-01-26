const chromium = require('chrome-aws-lambda');

exports.handler = async (event, ctx) => {
    console.log(event.queryStringParameters)
    const { queryStringParameters = {} } = event;
    const { name = 'Chewie' } = queryStringParameters;

    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    });
    
    const page = await browser.newPage();
    const HTML = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Document</title>
        </head>
        <body>
            <h1>Hello, ${name}!</h1>
        </body>
    </html>
    `
    await page.setContent(HTML)
    const pdf = await page.pdf({format: 'A4'});




    // await page.goto(pageToScreenshot, { waitUntil: 'networkidle2' });

    // const screenshot = await page.screenshot({ encoding: 'binary' });


    await browser.close();
  
    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({ 
    //         message: `Complete screenshot of ${pageToScreenshot}`, 
    //         buffer: screenshot 
    //     })
    // }

    return {
        statusCode: 200,
        isBase64Encoded: true,
        headers: {
          "Content-type": "application/pdf"
        },
        body: pdf.toString("base64")
      };
}
