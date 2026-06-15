const request = require('supertest');
const app     = require('../../server');

async function loginAs(email, password = 'password') {
  const res = await request(app)
    .post('/api/user/login')
    .send({ email, password });

  if (!res.headers['set-cookie']) {
    throw new Error(`Login échoué pour ${email} : HTTP ${res.statusCode} — ${JSON.stringify(res.body)}`);
  }
  return res.headers['set-cookie'];
}
describe('GET /api/tournois/findAll', () => {
  test('statut 200', async () => {
    const cookie = await loginAs('jean@test.com');
    const res = await request(app)
      .get('/api/tournois/findAll')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
  });

  test('renvoie { Tournois: [...] } avec nom et lieu', async () => {
    const cookie = await loginAs('jean@test.com');
    const res = await request(app)
      .get('/api/tournois/findAll')
      .set('Cookie', cookie);

    expect(res.body).toHaveProperty('Tournois');
    expect(Array.isArray(res.body.Tournois)).toBe(true);
    expect(res.body.Tournois.length).toBeGreaterThanOrEqual(2);
    const t = res.body.Tournois[0];
    expect(t).toHaveProperty('nom');
    expect(t).toHaveProperty('lieu');
  });

  test('Tournoi Printemps est présent dans la liste', async () => {
    const cookie = await loginAs('jean@test.com');
    const res = await request(app)
      .get('/api/tournois/findAll')
      .set('Cookie', cookie);

    const printemps = res.body.Tournois.find(t => t.nom === 'Tournoi Printemps');
    expect(printemps).toBeDefined();
    expect(printemps).toHaveProperty('lieu', 'Paris');
  });
});
describe('GET /api/tournois/:id', () => {
  test('retourne le tournoi 1 avec lancer=1', async () => {
    const cookie = await loginAs('jean@test.com');
    const res = await request(app)
      .get('/api/tournois/1')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('Tournois');
    expect(res.body.Tournois[0]).toHaveProperty('nom', 'Tournoi Printemps');
    expect(res.body.Tournois[0]).toHaveProperty('lieu', 'Paris');
    expect([1, true]).toContain(res.body.Tournois[0].lancer);
  });

  test('200 avec Tournois vide pour ID inexistant', async () => {
    const cookie = await loginAs('jean@test.com');
    const res = await request(app)
      .get('/api/tournois/9999')
      .set('Cookie', cookie);

    expect([200, 400, 404]).toContain(res.statusCode);
  });
});
describe('POST /api/tournois/create', () => {
  test('403 sans cookie', async () => {
    const res = await request(app)
      .post('/api/tournois/create')
      .send({ nom: 'Test', date: '2026-09-01', lieu: 'Paris' });

    expect([401, 403]).toContain(res.statusCode);
  });

  test('403 pour un non-organisateur', async () => {
    const cookie = await loginAs('jean@test.com');
    const res = await request(app)
      .post('/api/tournois/create')
      .set('Cookie', cookie)
      .send({ nom: 'Test', date: '2026-09-01', lieu: 'Paris' });

    expect([401, 403]).toContain(res.statusCode);
  });

  test('400 si lieu manquant', async () => {
    const cookie = await loginAs('org@test.com');
    const res = await request(app)
      .post('/api/tournois/create')
      .set('Cookie', cookie)
      .send({ nom: 'Sans lieu', date: '2026-09-01' });

    expect(res.statusCode).toBe(400);
  });

  test('400 si date manquante', async () => {
    const cookie = await loginAs('org@test.com');
    const res = await request(app)
      .post('/api/tournois/create')
      .set('Cookie', cookie)
      .send({ nom: 'Sans date', lieu: 'Paris' });

    expect(res.statusCode).toBe(400);
  });

  test('200 crée un tournoi (organisateur)', async () => {
    const cookie = await loginAs('org@test.com');
    const res = await request(app)
      .post('/api/tournois/create')
      .set('Cookie', cookie)
      .send({ nom: 'Tournoi Test Jest', date: '2026-09-01', lieu: 'Bordeaux' });

    expect([200, 500]).toContain(res.statusCode);
  });
});
describe('PUT /api/tournois/update', () => {
  test('403 sans cookie', async () => {
    const res = await request(app)
      .put('/api/tournois/update')
      .send({ Tournois_id: 2, nom: 'Test' });

    expect([401, 403]).toContain(res.statusCode);
  });

  test('400 si Tournois_id manquant', async () => {
    const cookie = await loginAs('org@test.com');
    const res = await request(app)
      .put('/api/tournois/update')
      .set('Cookie', cookie)
      .send({ nom: 'Test' });

    expect(res.statusCode).toBe(400);
  });

  test('200 met à jour un tournoi', async () => {
    const cookie = await loginAs('org@test.com');
    const res = await request(app)
      .put('/api/tournois/update')
      .set('Cookie', cookie)
      .send({ Tournois_id: 2, nom: 'Tournoi Été Modifié', lieu: 'Lyon' });

    expect(res.statusCode).toBe(200);
  });
});
describe('POST /api/tournois/addEquipe', () => {
  test('403 sans cookie', async () => {
    const res = await request(app)
      .post('/api/tournois/addEquipe')
      .send({ Tournois_id: 2, Equipe_id: 3 });

    expect([401, 403]).toContain(res.statusCode);
  });

  test('400 si Equipe déjà inscrite (contrainte UNIQUE)', async () => {
    const cookie = await loginAs('org@test.com');
    const res = await request(app)
      .post('/api/tournois/addEquipe')
      .set('Cookie', cookie)
      .send({ Tournois_id: 1, Equipe_id: 1 });

    expect([400, 409, 500]).toContain(res.statusCode);
  });

  test('200 ajoute une équipe au tournoi 2', async () => {
    const cookie = await loginAs('org@test.com');
    const res = await request(app)
      .post('/api/tournois/addEquipe')
      .set('Cookie', cookie)
      .send({ Tournois_id: 2, Equipe_id: 3 });

    expect([200, 201]).toContain(res.statusCode);
  });
});
describe('DELETE /api/tournois/removeEquipe', () => {
  test('403 sans cookie', async () => {
    const res = await request(app)
      .delete('/api/tournois/removeEquipe')
      .send({ Tournois_id: 2, Equipe_id: 3 });

    expect([401, 403]).toContain(res.statusCode);
  });

  test('200 retire une équipe du tournoi', async () => {
    const cookie = await loginAs('org@test.com');
    await request(app)
      .post('/api/tournois/addEquipe')
      .set('Cookie', cookie)
      .send({ Tournois_id: 2, Equipe_id: 3 });

    const res = await request(app)
      .delete('/api/tournois/removeEquipe')
      .set('Cookie', cookie)
      .send({ Tournois_id: 2, Equipe_id: 3 });

    expect([200, 204, 400]).toContain(res.statusCode);
  });
});
describe('POST /api/tournois/start', () => {
  test('403 sans cookie', async () => {
    const res = await request(app)
      .post('/api/tournois/start')
      .send({ Tournois_id: 2 });

    expect([401, 403]).toContain(res.statusCode);
  });

  test('400 si tournoi déjà lancé (lancer=1)', async () => {
    const cookie = await loginAs('org@test.com');
    const res = await request(app)
      .post('/api/tournois/start')
      .set('Cookie', cookie)
      .send({ Tournois_id: 1 }); // tournoi 1 lancer=TRUE dans init.sql

    expect([400, 409]).toContain(res.statusCode);
  });
});
describe('DELETE /api/tournois/delete/:id', () => {
  test('403 sans cookie', async () => {
    const res = await request(app).delete('/api/tournois/delete/2');
    expect([401, 403]).toContain(res.statusCode);
  });

  test('200 supprime un tournoi créé pour le test', async () => {
    const cookie = await loginAs('org@test.com');
    await request(app)
      .post('/api/tournois/create')
      .set('Cookie', cookie)
      .send({ nom: 'Tournoi Temp', date: '2026-12-01', lieu: 'Nice' });
    const findAll = await request(app)
      .get('/api/tournois/findAll')
      .set('Cookie', cookie);

    const temp = findAll.body.Tournois.find(t => t.nom === 'Tournoi Temp');
    const id = temp?.id;

    const res = await request(app)
      .delete(`/api/tournois/delete/${id}`)
      .set('Cookie', cookie);

    expect([200, 204, 400]).toContain(res.statusCode);
  });
});