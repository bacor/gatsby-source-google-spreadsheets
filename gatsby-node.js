const crypto = require('crypto');
const { type } = require('os');
const fetchSheet = require('./lib/fetchSheet.js').default;

exports.sourceNodes = async (
  { actions },
  { spreadsheetId, credentials, apiKey, typeName },
) => {
  const { createNode } = actions;
  console.log('Fetching Google Sheet', fetchSheet, spreadsheetId);
  const sheets = await fetchSheet(spreadsheetId, credentials, apiKey);
  Object.entries(sheets).forEach(([name, data]) => {
    if (Array.isArray(data)) {
      data.forEach(row => {
        name = name.replace(/[\W_]+/g, '');
        return createNode(
          Object.assign(row, {
            parent: '__SOURCE__',
            children: [],
            internal: {
              type: (typeName !== undefined) 
                ? typeName(name) 
                : `google${name.charAt(0).toUpperCase()}${name.slice(
                  1,
                )}Sheet`,
              contentDigest: crypto
                .createHash('md5')
                .update(JSON.stringify(row))
                .digest('hex'),
            },
          }),
        );
      });
    }
  });
  createNode(
    Object.assign(sheets, {
      parent: '__SOURCE__',
      children: [],
      internal: {
        type: 'googleSheet',
        contentDigest: crypto
          .createHash('md5')
          .update(JSON.stringify(sheets))
          .digest('hex'),
      },
    }),
  );
};
