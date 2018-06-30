const MergeIntoSingle = require('./index.js');

jest.mock('fs');
jest.mock('glob');

const fs = require('fs');
const glob = require('glob');

describe('MergeIntoFile', () => {
  const pathToFiles = {
    'file1.js': ['1.js'],
    'file2.js': ['2.js'],
    '*.css': ['3.css', '4.css'],
  };

  const fileToContent = {
    '1.js': 'FILE_1_TEXT',
    '2.js': 'FILE_2_TEXT',
    '3.css': 'FILE_3_TEXT',
    '4.css': 'FILE_4_TEXT',
  };

  it('should succeed merging using mock content', (done) => {
    fs.readFile.mockImplementation((fileName, options, cb) => cb(null, fileToContent[fileName]));
    glob.mockImplementation((path, options, cb) => cb(null, pathToFiles[path]));
    const instance = new MergeIntoSingle({
      files: {
        'script.js': [
          'file1.js',
          'file2.js',
        ],
        'style.css': [
          '*.css',
        ],
      },
    });
    instance.apply({
      plugin: (xx, fun) => {
        const obj = {
          assets: {},
        };
        fun(obj, (err) => {
          expect(err).toEqual(undefined);
          expect(obj.assets['script.js'].source()).toEqual('FILE_1_TEXT\nFILE_2_TEXT');
          expect(obj.assets['style.css'].source()).toEqual('FILE_3_TEXT\nFILE_4_TEXT');
          done();
        });
      },
    });
  });
});
