const { Restitup } = require('restitup');
const { $HttpStatus, $asyncSpec } = Restitup.modules

describe('Functional CRUD operations on Groups', () => {
  let currentIdGroups = [];
  const postGroup1 = {
    title: 'API Group 1 - ' + Date.now(),
    description: 'testing api group 1 '+ Date.now(),
    'privacy_level': 'everyone',
    admin: 1
  };
  const postGroup2 = {
    title: 'API Group 2 - ' + Date.now(),
    description: 'testing api group 2 '+ Date.now(),
    'privacy_level': 'school',
    admin: 1
  };
  const postGroup3 = {
    title: 'API Group 3 - ' + Date.now(),
    description: 'testing api group 3 '+ Date.now(),
    'privacy_level': 'group',
    admin: 1
  };
  afterEach($asyncSpec(async (done) => {
    for (let i = 0; i < currentIdGroups.length; i++) {
      const idGroup = currentIdGroups[i];
      await Restitup.Group.delete(idGroup);
    }
    currentIdGroups = [];
    done();
  }));

  it('POST: Es posible crear un grupo propio desde el API', $asyncSpec(async (done) => {
    const {statusCode, data} = await Restitup.Group.post(postGroup1);
    expect(statusCode).toEqual($HttpStatus.CREATED);
    expect(data.id).toBeDefined();
    currentIdGroups.push(data.id);
    expect(data['access_code']).toBeDefined();
    expect(data.title).toBe(postGroup1.title);
    expect(data.description).toBe(postGroup1.description);
    done();
  }));
  
  it('GET: Es posible obtener la información de un grupo desde el API', $asyncSpec(async (done) => {
    const {statusCode: status, data: group} = await Restitup.Group.post(postGroup2);
    expect(status).toEqual($HttpStatus.CREATED);
    currentIdGroups.push(group.id);

    const {statusCode, data} = await Restitup.Group.getOne(group.id);
    expect(statusCode).toEqual($HttpStatus.OK);
    expect(data.id).toBeDefined();
    expect(data.id).toBe(group.id);
    expect(data.admin).toBe(1);
    done()
  }));

  it('PUT: Es posible actualizar un grupo propio desde el API', $asyncSpec(async (done) => {
    const update = {
      title: 'API Group Updated - ' + Date.now(),
      options: {
        create_discussion: 1,
        invite_type: 2
      }
    };

    const {statusCode: postStatus, data: group} = await Restitup.Group.post(postGroup2);
    expect(postStatus).toEqual($HttpStatus.CREATED);
    currentIdGroups.push(group.id);

    const {statusCode: updateStatus} = await Restitup.Group.put(group.id, update);
    expect(updateStatus).toEqual($HttpStatus.NO_CONTENT);

    const {statusCode, data} = await Restitup.Group.getOne(group.id);
    expect(statusCode).toEqual($HttpStatus.OK);
    expect(data.id).toBe(group.id);
    expect(data.title).toBe(update.title);
    expect(data.admin).toBe(1);
    done()
  
  }));

  it('GET: Es posible obtener una lista de grupos desde el API', $asyncSpec(async (done) => {
    const {statusCode: postStatus1, data: group1} = await Restitup.Group.post(postGroup1);
    expect(postStatus1).toEqual($HttpStatus.CREATED);
    currentIdGroups.push(group1.id);

    const {statusCode: postStatus2, data: group2} = await Restitup.Group.post(postGroup2);
    expect(postStatus2).toEqual($HttpStatus.CREATED);
    currentIdGroups.push(group2.id);

    const {statusCode: postStatus3, data: group3} = await Restitup.Group.post(postGroup3);
    expect(postStatus3).toEqual($HttpStatus.CREATED);
    currentIdGroups.push(group3.id);

    const {statusCode, data} = await Restitup.Group.get();
    expect(statusCode).toEqual($HttpStatus.OK);
    expect(data.group).toBeDefined();
    expect(data.total).toBeDefined();
    expect(data.links).toBeDefined();
    expect(Array.isArray(data.group)).toBeTruthy();
    expect(data.group.length >= 3).toBeTruthy();
    expect(data.group.length).toBe(parseInt(data.total));
    done();
  }));

  it('DELETE: Es posible eliminar un grupo propio desde el API', $asyncSpec(async (done) => {
    const {statusCode: postStatus, data: group} = await Restitup.Group.post(postGroup2);
    expect(postStatus).toEqual($HttpStatus.CREATED);
    currentIdGroups.push(group.id);

    const {statusCode: deleteStatus} = await Restitup.Group.delete(group.id);
    expect(deleteStatus).toEqual($HttpStatus.NO_CONTENT);

    const {statusCode: getStatus} = await Restitup.Group.getOne(group.id);
    expect(getStatus).toEqual($HttpStatus.FORBIDDEN);
    done()
  }));

});