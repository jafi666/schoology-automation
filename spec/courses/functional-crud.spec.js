const { Restitup } = require('restitup');
const { $HttpStatus, $asyncSpec } = Restitup.modules

describe('Functional CRUD operations on Courses', () => {
  it('Should get a list of courses', $asyncSpec(async (done) => {
    const {statusCode, data} = await Restitup.Courses.get();
    expect(statusCode).toEqual($HttpStatus.OK);
    expect(data.course).toBeDefined();
    expect(parseInt(data.total)).toBe(data.course.length);
    done();
  }));
});