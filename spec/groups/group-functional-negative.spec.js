const { Restitup } = require('restitup');
const { $HttpStatus, $asyncSpec } = Restitup.modules

xdescribe('Functional NEGATIVE operations on Groups', () => {
  const postGroup1 = {
    title: 'API Empty Group 1 - ' + Date.now(),
    description: 'testing api empty group 1 '+ Date.now(),
  };
  const postGroup2 = {
    title: 'API Empty Group 2 - ' + Date.now(),
    description: 'testing api empty group 2 '+ Date.now(),
  };

  xit('POST: Es posible crear un grupo cualquiera desde el API', $asyncSpec(async (done) => {
    const {statusCode: postStatus, data} = await Restitup.Group.post(postGroup1);
    expect(postStatus).toEqual($HttpStatus.CREATED);
    expect(data.id).toBeDefined();
    expect(data['access_code']).toBeNull();
    expect(data.title).toBe(postGroup1.title);
    expect(data.description).toBe(postGroup1.description);

    const {statusCode, data: enrollments} = await Restitup.Group.getRelation(data.id, 'enrollments');
    expect(statusCode).toEqual($HttpStatus.OK);
    expect(enrollments.enrollment).toBeDefined();
    expect(enrollments.total).toBeDefined();
    expect(enrollments.links).toBeDefined();
    expect(Array.isArray(enrollments.enrollment)).toBeTruthy();
    expect(enrollments.enrollment.length).toBe(0);
    expect(enrollments.enrollment.length).toBe(parseInt(enrollments.total));
    done(); 
  }));

  xit('PUT: NEGATIVE: No es posible actualizar un grupo no propio desde el API', $asyncSpec(async (done) => {
    const {statusCode: postStatus, data: group} = await Restitup.Group.post(postGroup2);
    expect(postStatus).toEqual($HttpStatus.CREATED);

    const update = {
      title: 'Group title updated from non admin users'
    };
    const {statusCode: updateStatus} = await Restitup.Group.put(group.id, update);
    expect(updateStatus).toEqual($HttpStatus.FORBIDDEN);
    done(); 
  }));

  xit('DELETE: NEGATIVE: No es posible eliminar un grupo no propio desde el API', $asyncSpec(async (done) => {
    const {statusCode: postStatus, data: group} = await Restitup.Group.post(postGroup2);
    expect(postStatus).toEqual($HttpStatus.CREATED);

    const {statusCode: deleteStatus} = await Restitup.Group.delete(group.id);
    expect(deleteStatus).toEqual($HttpStatus.FORBIDDEN);

    done(); 
  }));
});