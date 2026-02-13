### Routes pour l'API


## User :

# POST : api/user/login                 Met un Cookie avec token JWT dans le front
# GET : api/user/logout                 Supprime le Cookie
# GET : api/user/me                     Renvoie les infos de l'utilisateur connecter
# PUT : api/user/update                 Modifie les infos de l'utilisateur
# DELETE : api/user/delete/id           Supprime un utilisateur
# GET : api/user/verif                  Renvoie tout les utilissateur non confirmé (pour les admins)
# PUT : api/user/verif                  Comfirme l'inscription d'un utilisateur (pour les admins)
# GET : api/user/:id                    Renvoie les infos d'un l'utilisateur


## Joueur

# GET api/joueur/findAll                Renvoie tout les joueurs


## Selectionneur

# GET api/selectionneur/findAll         Renvoie tout les selectionneurs


## Organisateur

# GET api/organisateur/findAll          Renvoie tout les organisateur

## Match

# PUT : api/match/update                Modifie un match
# POST : api/match/create               Crée un match
# GET : api/match/findByTournoisId/:id  Renvoie les matchs d’un tournoi
# GET : api/match/:id                   Renvoie un match

## Tournois

# POST : api/tournois/create            Crée un tournoi
# PUT : api/tournois/update             Modifie un tournoi
# GET : api/tournois/findAll            Renvoie tous les tournois
# DELETE : api/tournois/delete/:id      Supprime un tournoi
# POST : api/tournois/addEquipe         Ajoute une équipe à un tournoi
# DELETE : api/tournois/removeEquipe    Retire une équipe d’un tournoi
# POST : api/tournois/start             Démarre un tournoi
# GET : api/tournois/:id                Renvoie un tournoi

## Groupe

# POST : api/groupe/add                 Ajoute un utilisateur dans un groupe
# DELETE : api/groupe/remove            Supprime un utilisateur d’un groupe
# PUT : api/groupe/rename               Renomme un groupe
# POST : api/groupe/create              Crée un groupe
# GET : api/groupe/info/:id             Renvoie les infos d’un groupe
# DELETE : api/groupe/delete/:id        Supprime un groupe
# DELETE : api/groupe/messageDelete/:id Supprime un message d’un groupe
# POST : api/groupe/messageCreate       Crée un message dans un groupe
# GET : api/groupe/messageFindAll/:id   Renvoie tous les messages d’un groupe
# PUT : api/groupe/messageUpdate        Modifie un message d’un groupe

## Equipe

# POST : api/equipe/addJoueur           Ajoute un joueur à une équipe
# DELETE : api/equipe/removeJoueur      Supprime un joueur d’une équipe
# PUT : api/equipe/rename               Renomme une équipe
# POST : api/equipe/create              Crée une équipe
# GET : api/equipe/findAll              Renvoie toutes les équipes
# DELETE : api/equipe/delete            Supprime une équipe
# GET : api/equipe/:id                  Renvoie une équipe

## But

# PUT : api/but/update                  Modifie un but
# POST : api/but/create                 Crée un but
# GET : api/but/:id                     Renvoie un but
# GET : api/but/findAllByMatch/:id      Renvoie tous les buts d’un match
# DELETE : api/but/delete/:id           Supprime un but

## Message

# POST : api/message/create             Crée un message
# PUT : api/message/update              Modifie un message
# DELETE : api/message/delete/:id       Supprime un message
# GET : api/message/findAll             Renvoie tous les messages

## Formulaire

# POST : api/form/                      Envoie un formulaire
# GET : api/form/                       Renvoie tous les formulaires
# POST : api/form/confirm               Confirme un formulaire
