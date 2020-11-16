const {
  groupImages
} = require('../src/lib/helpers');

const { data, expectedResult } = require('./testData/googleDriveData');


describe('#groupImages', () => {
  it('should return a correctly formatted payload', () => {
    const actual = groupImages(data().files)
    expect(actual).toEqual(expectedResult())
  })
})