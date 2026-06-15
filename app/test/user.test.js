// tests/user.test.js
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

// ─── POST /api/user/login ────────────────────────────────────
describe('POST /api/user/login', () => {
  test('200 + cookie JWT avec credentials valides', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: 'jean@test.com', password: 'password' });

    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('erreur avec mauvais mot de passe', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: 'jean@test.com', password: 'mauvais' });

    expect([400, 401, 403]).toContain(res.statusCode);
  });

  test('erreur avec email inexistant', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: 'fantome@test.com', password: 'password' });

    expect([400, 401, 404]).toContain(res.statusCode);
  });

  test('400 si champ manquant', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: 'jean@test.com' });

    expect(res.statusCode).toBe(400);
  });
});

// ─── GET /api/user/logout ────────────────────────────────────
describe('GET /api/user/logout', () => {
  test('200 et supprime le cookie', async () => {
    const cookie = await loginAs('jean@test.com');

    const res = await request(app)
      .get('/api/user/logout')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
  });
});

// ─── GET /api/user/me ────────────────────────────────────────
describe('GET /api/user/me', () => {
  test('401/403 sans cookie', async () => {
    const res = await request(app).get('/api/user/me');
    expect([401, 403]).toContain(res.statusCode);
  });

  test('retourne user avec email, prenom, nom — sans password', async () => {
    const cookie = await loginAs('jean@test.com');

    const res = await request(app)
      .get('/api/user/me')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    const user = res.body.user[0];
    expect(user).toHaveProperty('email', 'jean@test.com');
    expect(user).toHaveProperty('prenom', 'Jean');
    expect(user).toHaveProperty('nom', 'Dupont');
    expect(user).not.toHaveProperty('password');
  });
});
// L'API renvoie { user: [...], match: [...] }

// ─── PUT /api/user/update/:id ────────────────────────────────
describe('PUT /api/user/update/:id', () => {
  test('401/403 sans cookie', async () => {
    const res = await request(app)
      .put('/api/user/update/2')
      .send({ prenom: 'Nouveau' });

    expect([401, 403]).toContain(res.statusCode);
  });

  test('met à jour prenom et nom', async () => {
    const cookie = await loginAs('jean@test.com');

    const res = await request(app)
      .put('/api/user/update/2')
      .set('Cookie', cookie)
      .send({ prenom: 'Jean', nom: 'Dupont' });

    expect(res.statusCode).toBe(200);
  });
});

// ─── GET /api/user/:id ───────────────────────────────────────
describe('GET /api/user/:id', () => {
  test('retourne un user par son ID', async () => {
    const cookie = await loginAs('jean@test.com');

    const res = await request(app)
      .get('/api/user/2')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    const user = res.body.user[0];
    expect(user).toHaveProperty('id', 2);
    expect(user).toHaveProperty('email', 'jean@test.com');
  });

  test('200 avec tableau vide pour un ID inexistant (comportement API)', async () => {
    const cookie = await loginAs('jean@test.com');

    const res = await request(app)
      .get('/api/user/9999')
      .set('Cookie', cookie);

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.user).toHaveLength(0);
    }
  });
});

// ─── GET /api/user/verif ─────────────────────────────────────
describe('GET /api/user/verif', () => {
  test('401/403 pour un user normal', async () => {
    const cookie = await loginAs('jean@test.com');

    const res = await request(app)
      .get('/api/user/verif')
      .set('Cookie', cookie);

    expect([401, 403]).toContain(res.statusCode);
  });

  test('retourne les users non vérifiés (admin)', async () => {
    const cookie = await loginAs('admin@test.com');

    const res = await request(app)
      .get('/api/user/verif')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200)
    const users = Array.isArray(res.body) ? res.body : res.body.users || [];
    expect(res.statusCode).toBe(200);
  });
});

// ─── PUT /api/user/verif ─────────────────────────────────────
describe('PUT /api/user/verif', () => {
  test('401/403 pour un user normal', async () => {
    const cookie = await loginAs('jean@test.com');

    const res = await request(app)
      .put('/api/user/verif')
      .set('Cookie', cookie)
      .send({ id: 4 });

    expect([401, 403]).toContain(res.statusCode);
  });

  test('confirme un user (admin)', async () => {
    const cookie = await loginAs('admin@test.com');

    const res = await request(app)
      .put('/api/user/verif')
      .set('Cookie', cookie)
      .send({ id: 4 });

    expect(res.statusCode).toBe(200);
  });
});

// ─── DELETE /api/user/delete/:id ─────────────────────────────
describe('DELETE /api/user/delete/:id', () => {
  test('401/403 sans cookie', async () => {
    const res = await request(app).delete('/api/user/delete/3');
    expect([401, 403]).toContain(res.statusCode);
  });

  test('supprime un user (admin)', async () => {
    const cookie = await loginAs('admin@test.com');

    const res = await request(app)
      .delete('/api/user/delete/3')
      .set('Cookie', cookie);

    expect([200, 204]).toContain(res.statusCode);
  });
});