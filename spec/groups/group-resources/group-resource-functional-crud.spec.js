const { Restitup } = require('restitup');
const { $HttpStatus, $asyncSpec } = Restitup.modules

describe('Functional CRUD operations on Groups', () => {
  const RESOURCE = 'resources';
  let group = {};
  const postGroup = {
    title: 'API Resource Container Group - ' + Date.now(),
    description: 'testing api resource container group '+ Date.now(),
    'privacy_level': 'school',
    admin: 1
  };

  beforeAll($asyncSpec(async (done) => {
    const {data} = await Restitup.Group.post(postGroup);
    group = data;
    done();
  }));

  afterAll($asyncSpec(async (done) => {
    await Restitup.Group.delete(group.id);
    done();
  }));

  it('POST: Es posible crear un recurso de tipo documento sobre un grupo propio', $asyncSpec(async (done) => {
    const resource = {
      'title': 'Un buscador popular para todo',
      'type': 'document',
      'resource_notes': 'Inicia tu búsqueda',
      'attachments': [
        {
          'url': 'www.google.com'
        }
      ]
    };
    const {statusCode, data} = await Restitup.Group.postRelation(group.id, resource, RESOURCE);
    expect(statusCode).toEqual($HttpStatus.CREATED);
    expect(data.id).toBeDefined();
    expect(data['collection_id']).toBeDefined();
    expect(data.title).toBe(resource.title);
    expect(data.type).toBe(resource.type);
    expect(data['resource_notes']).toBe(resource['resource_notes']);
    done();  
  }));

  it('POST: Es posible crear un recurso de tipo plantilla de tema de discusión sobre un grupo propio', $asyncSpec(async (done) => {
    const resource = {
      'title': 'API Testing',
      'type': 'discussion',
      'resource_notes': 'Que es el API testing?',
      'template_fields': {
        'body': 'Anota tus comentarios al respecto'
      }
    };
  
    const {statusCode, data} = await Restitup.Group.postRelation(group.id, resource, RESOURCE);
    expect(statusCode).toEqual($HttpStatus.CREATED);
    expect(data.id).toBeDefined();
    expect(data['collection_id']).toBeDefined();
    expect(data.title).toBe(resource.title);
    expect(data.type).toBe(resource.type);
    expect(data['resource_notes']).toBe(resource['resource_notes']);
    expect(data['template_fields']['body']).toBe(resource['template_fields']['body']);
    done();
  }));

  it('POST: Es posible crear un recurso de tipo plantilla de tarea sobre un grupo propio', $asyncSpec(async (done) => {
    const resource = {
      'title': 'Realizar Investigacion',
      'type': 'assignment',
      'resource_notes': 'Investigar Agile',
      'template_fields': {
        'body': 'Que es Agile y como se aplica?',
        'max_points': 100
      }
    };
  
    const {statusCode, data} = await Restitup.Group.postRelation(group.id, resource, RESOURCE);
    expect(statusCode).toEqual($HttpStatus.CREATED);
    expect(data.id).toBeDefined();
    expect(data['collection_id']).toBeDefined();
    expect(data.title).toBe(resource.title);
    expect(data.type).toBe(resource.type);
    expect(data['resource_notes']).toBe(resource['resource_notes']);
    expect(data['template_fields']['body']).toBe(resource['template_fields']['body']);
    expect(data['template_fields']['max_points']).toBe(resource['template_fields']['max_points']);
    done();
  }));

  it('POST: Es posible crear un recurso de tipo página sobre un grupo propio', $asyncSpec(async (done) => {
    const resource = {
      'title': 'Publicaciones',
      'type': 'page',
      'template_fields': {
        'body': 'Investigacion de desarrollo.'
      }
    };
  
    const {statusCode, data} = await Restitup.Group.postRelation(group.id, resource, RESOURCE);
    expect(statusCode).toEqual($HttpStatus.CREATED);
    expect(data.id).toBeDefined();
    expect(data['collection_id']).toBeDefined();
    expect(data.title).toBe(resource.title);
    expect(data.type).toBe(resource.type);
    expect(data['template_fields']['body']).toContain(resource['template_fields']['body']);
    done();
  }));

  it('GET: Es posible obtener los recursos disponibles en un grupo propio', $asyncSpec(async (done) => {
    const {statusCode, data} = await Restitup.Group.getRelation(group.id, RESOURCE);
    expect(statusCode).toEqual($HttpStatus.OK);
    expect(data.resources).toBeDefined();
    expect(data.total).toBeDefined();
    expect(data.links).toBeDefined();
    expect(Array.isArray(data.resources)).toBeTruthy();
    expect(data.resources.length > 0).toBeTruthy();
    expect(data.resources.length).toBe(parseInt(data.total));    
    done();
  }));

  it('POST: NEGATIVE: No es posible crear un recurso de tipo plantilla de prueba o cuestionario sobre un grupo propio desde el API', $asyncSpec(async (done) => {
    const resource = {
      'title': 'Take your Assessment',
      'type': 'assessment',
      'template_fields': {
          'body': 'Read your questions carefully',
          'max_points': 100
      }
    };
    const {statusCode, data} = await Restitup.Group.postRelation(group.id, resource, RESOURCE);
    expect(statusCode).toEqual($HttpStatus.BAD_REQUEST);
    expect(data).toContain('Schoology does not currently support the specified template type through the API');
    done();
  }));
});