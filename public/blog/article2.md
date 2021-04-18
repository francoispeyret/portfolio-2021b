### Your first nginx server on ubuntu

#### pré-requis

Pour suivre ce guide étape par étape, vous avez besoin de :

- Server sur **Ubuntu 20.04+**
- Un accès root sur le système
- un terminal ou accès ssh

Pour la suite connectes-toi sur le serveur et suis les étapes qui suit.

#### Étape 1 : installation de *Nginx* de base

*Nginx* est maintenant disponible dans les dépots officiels de ubuntu
Il suffit donc de l'installer sans avoir à ajouter de sources additionnels.

```shell
sudo apt update
sudo apt install nginx
```

🤞 L'installation devrait procéder sans avoir à gérer d'options particulière.

#### Étape 2 : authoriser *Nginx* à parler vers l'extérieur (firewall) 

Par défaut sur une installation **Ubuntu 20.04**, ton système est
protégé par **ufw** et il est donc néscessaire d'autoriser le process
nginx à passer ce firewall.

Pour voir ce qui est déjà autoriser voici la commande :

```shell
sudo ufw app list
```

Pour autoriser notre *Nginx* maintenant utiliser cette commande :

```shell
sudo ufw allow 'Nginx HTTP'
```

Pour vérifier que l'autoriser s'est bien passé voilà ce qu'il faut faire :

```shell
sudo ufw status
```

Cela devrait indiquer différentes lignes, celles qui nous intéresse
sont les suivantes : 

```text
To                  Action       From
--                  ------       ----
Nginx HTTP          ALLOW        Anywhere
Nginx HTTP (v6)     ALLOW        Anywhere (v6)
```

#### Étape 3 : Vérifier le status du serveur *Nginx*

Pour vérifier l'état du service *nginx*, il te faut taper cette commande :

```shell
systemctl status nginx
```

Je te conseil de prendre en main la commande ```systemctl``` celle-ci
va te servir souvant lors des modifications de configuration.

L'option status te renvois donc l'état du serveur et dans la ligne
de commande précédente, tu devrais avoir un retour avec la ligne suivante :

```text
...
   Loaded: loaded
   Active: active (running) since Xxx 202X-XX-XX .....
     Docs: man:nginx(8)
...
```

Et pour vérifier le bon fonctionnement, tu peux aller sur ton navigateur
pour vérifier la page d'attente par défaut du serveur.

Le fameux "**Welcome to nginx!**" sur l'url de ton serveur.
Si tu travail localement alors cela se passe sur <http://localhost>
sinon utilise l'adresse IP de ton serveur.


#### Étape 4 : Mettre en place un *Server Block*

Dans cette partie tu vas apprendre à ajouter un domain à ton serveur.

Par défaut le dossier où est héberger les données est dans ```/var/www/html```,
avant de faire la suite de cette étape, il est important de vérifier
cela pour continuer cette étape.

Dans les commande suivante remaplace ```the_domain``` par le nom du
domain que tu veux héberger par exemple par ```www.example.com```.

##### Création du site de test

```shell
sudo mkdir -p /var/www/the_domain/html
```

Il est important d'attribuer les droits au nouveau fichier :

```shell
sudo chown -R $USER:$USER /var/www/the_domain/html
sudo chmod -R 755 /var/www/the_domain
```

On va créer un fichier pour tester notre configuration plus tard : 

```shell
nano /var/www/the_domain/html/index.html
```

insère les lignes suivantes dans le fichier :

```html
<html>
    <head>
        <title>Bienvenue sur the_domain !</title>
    </head>
    <body>
        <h1>Bravo! the_domain est disponible.</h1>
    </body>
</html>
```

Pour sauvegarder et fermer le document utilise ```CTRL``` + ```X```
puis ```Y``` et enfin ```ENTER``.


##### Créer un fichier de configuration

Maintenant nous allons créer le fichier de configuration pour *Nginx*

```shell
sudo nano /etc/nginx/sites-available/the_domain
```

Et coller la configuration suivante, en pensant bien remplacer les ``the_domain`` :

```text
server {
        listen 80;
        listen [::]:80;

        root /var/www/the_domain/html;
        index index.html index.htm;

        server_name the_domain www.the_domain;

        location / {
                try_files $uri $uri/ =404;
        }
}
```

##### Options :

Si tu veux utiliser php sur ton serveur, tu dois ajouter ce type de fichier
dans la ligne suivante 

```text
index index.php index.html index.htm;
```

Le ```server_name``` peut être modifier selon l'usage.
Si tu ne veux pas de sous-domaine "www" à ton domaine alors voilà 
à quoi doit ressembler la ligne :

````text
server_name the_domain;
````

##### Activer la nouvelle configuration créée

```shell
sudo ln -s /etc/nginx/sites-available/the_domain /etc/nginx/sites-enabled/
```

En faisant un lien symbolique vers le fichier stocker dans /sites-available
tu pourras facilement voir quel config est utiliser ou non dans /site-enabled.

Et si une configuration ne doit plus être utilisé alors il suffira de supprimer
le liens et tu garderas quand-même le fichier de config dans /site-avaible.


##### Vérifier sa configuration créée

Au cas où une erreure s'est glisser dans les fichiers de configuration
une commande permet de vérifier celle-ci.

````shell
sudo nginx -t
````

##### Relancer *Nginx* 🚀

```shell
sudo systemctl restart nginx
```

Si tout c'est bien passé, vous pouvez maintenant accéder a votre nouveau domaine.

#### Ressource :

- [Comment installer Nginx sur Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04-fr)
