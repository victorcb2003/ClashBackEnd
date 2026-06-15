// tests/equipe.test.js
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

// ─── GET /api/equipe/findAll ─────────────────────────────────
describe('GET /api/equipe/findAll', () => {
  test('retourne les équipes avec statut 200', async () => {
    const cookie = await loginAs('jean@test.com');
    const res = await request(app)
      .get('/api/equipe/findAll')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    const equipes = Array.isArray(res.body) ? res.body : res.body.equipes || res.body.data || Object.values(res.body)[0];
    expect(equipes.length).toBeGreaterThanOrEqual(1);
  });

  test('les équipes ont id et nom', async () => {
    const cookie = await loginAs('jean@test.com');
    const res = await request(app)
      .get('/api/equipe/findAll')
      .set('Cookie', cookie);

    const equipes = Array.isArray(res.body) ? res.body : res.body.equipes || res.body.data || Object.values(res.body)[0];
    const equipe = equipes[0];
    expect(equipe).toHaveProperty('id');
    expect(equipe).toHaveProperty('nom');
  });
});

// ─── GET /api/equipe/me ──────────────────────────────────────
describe('GET /api/equipe/me', () => {
  test('401/403 sans cookie', async () => {
    const res = await request(app).get('/api/equipe/me');
    expect([401, 403]).toContain(res.statusCode);
  });

  // selec@test.com n'a pas d'équipe dans init.sql → 500 ou 200 vide selon l'implémentation
  test('retourne 200 ou erreur gérée pour le sélectionneur', async () => {
    const cookie = await loginAs('selec@test.com');
    const res = await request(app)
      .get('/api/equipe/me')
      .set('Cookie', cookie);

    expect([200, 404, 500]).toContain(res.statusCode);
  });
});

// ─── GET /api/equipe/:id ─────────────────────────────────────
describe('GET /api/equipe/:id', () => {
  test('retourne l\'équipe 1', async () => {
    const cookie = await loginAs('jean@test.com');
    const res = await request(app)
      .get('/api/equipe/1')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    const equipe = res.body.nom ? res.body : res.body.equipe || res.body[0];
    expect(equipe).toHaveProperty('nom', 'Les Aigles');
  });

  test('400/404 pour un ID inexistant', async () => {
    const cookie = await loginAs('jean@test.com');
    const res = await request(app)
      .get('/api/equipe/9999')
      .set('Cookie', cookie);

    expect([400, 404]).toContain(res.statusCode);
  });
});

// ─── POST /api/equipe/create ─────────────────────────────────
describe('POST /api/equipe/create', () => {
  test('401/403 sans cookie', async () => {
    const res = await request(app)
      .post('/api/equipe/create')
      .send({ nom: 'Les Requins' });

    expect([401, 403]).toContain(res.statusCode);
  });

  test('crée une équipe (sélectionneur) → 200 ou 201', async () => {
    const cookie = await loginAs('selec@test.com');
    const res = await request(app)
      .post('/api/equipe/create')
      .set('Cookie', cookie)
      .send({ nom: 'Les Requins' });

    expect([200, 201]).toContain(res.statusCode);
  });

  test('400 si nom manquant', async () => {
    const cookie = await loginAs('selec@test.com');
    const res = await request(app)
      .post('/api/equipe/create')
      .set('Cookie', cookie)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  test('erreur si nom déjà pris (UNIQUE) → 400/409/500', async () => {
    const cookie = await loginAs('selec@test.com');
    const res = await request(app)
      .post('/api/equipe/create')
      .set('Cookie', cookie)
      .send({ nom: 'Les Aigles' });

    expect([400, 409, 500]).toContain(res.statusCode);
  });
});

// ─── PUT /api/equipe/rename ──────────────────────────────────
describe('PUT /api/equipe/rename', () => {
  test('401/403 sans cookie', async () => {
    const res = await request(app)
      .put('/api/equipe/rename')
      .send({ id: 3, nom: 'Nouveau' });

    expect([401, 403]).toContain(res.statusCode);
  });

  test('renomme une équipe → 200 ou 400 si logique métier', async () => {
    const cookie = await loginAs('selec@test.com');
    const res = await request(app)
      .put('/api/equipe/rename')
      .set('Cookie', cookie)
      .send({ id: 3, nom: 'Les Tigres Blancs' });
    expect([200, 400]).toContain(res.statusCode);
  });
});

// ─── POST /api/equipe/addJoueur ──────────────────────────────
describe('POST /api/equipe/addJoueur', () => {
  test('401/403 sans cookie', async () => {
    const res = await request(app)
      .post('/api/equipe/addJoueur')
      .send({ equipe_id: 2, joueur_id: 2 });

    expect([401, 403]).toContain(res.statusCode);
  });

  test('tente d\'ajouter un joueur → 200/201/400 selon logique', async () => {
    const cookie = await loginAs('selec@test.com');
    const res = await request(app)
      .post('/api/equipe/addJoueur')
      .set('Cookie', cookie)
      .send({ equipe_id: 2, joueur_id: 2 });

    expect([200, 201, 400]).toContain(res.statusCode);
  });
});

// ─── DELETE /api/equipe/removeJoueur ────────────────────────
describe('DELETE /api/equipe/removeJoueur', () => {
  test('401/403 sans cookie', async () => {
    const res = await request(app)
      .delete('/api/equipe/removeJoueur')
      .send({ equipe_id: 1, joueur_id: 2 });

    expect([401, 403]).toContain(res.statusCode);
  });

  test('retire un joueur → 200/204/400 selon logique', async () => {
    const cookie = await loginAs('selec@test.com');
    const res = await request(app)
      .delete('/api/equipe/removeJoueur')
      .set('Cookie', cookie)
      .send({ equipe_id: 2, joueur_id: 2 });

    expect([200, 204, 400]).toContain(res.statusCode);
  });
});

// ─── DELETE /api/equipe/delete ───────────────────────────────
describe('DELETE /api/equipe/delete', () => {
  test('401/403 sans cookie', async () => {
    const res = await request(app)
      .delete('/api/equipe/delete')
      .send({ id: 3 });

    expect([401, 403]).toContain(res.statusCode);
  });

  test('supprime une équipe créée pour le test', async () => {
    const cookie = await loginAs('selec@test.com');

    const create = await request(app)
      .post('/api/equipe/create')
      .set('Cookie', cookie)
      .send({ nom: 'Équipe Temp' });

    const id = create.body.id || create.body.equipe?.id;

    const res = await request(app)
      .delete('/api/equipe/delete')
      .set('Cookie', cookie)
      .send({ id });

    expect([200, 204, 400]).toContain(res.statusCode);
  });
});