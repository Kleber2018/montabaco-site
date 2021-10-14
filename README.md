# SSE_Eletromecanica
App em PWA para solicitar serviços eletromecânicos

## INSTALAÇÃO
Preparando o ambiente de trabalho:
instalar o vscode linux com snap: sudo snap install --classic code
instalar o npm: sudo apt install npm
verificar se foram instalados: 
```  
nodejs -v
npm -v
Angular CLI: ng version
```

Atualizar:

Node estável:
    Instalar o nodejs: ```sudo apt install nodejs```
ou
```
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
```

Angular CLI
    Remover versão anterior: ```sudo rm -rf /usr/local/bin/ng```
    instalar o CLI: ```sudo npm install -g @angular/cli```

Atualizar: 
    ```npm install -g npm```
ou 
    ```npm install```
ou
    ```ng update```

ou atualizar globalmente:
```
    npm uninstall --save-dev angular-cli
    npm install --save-dev @angular/cli@11.2.14
    npm i @angular/cli@11.2.14
```


## Generate Angular

Generate módulo com rota:

```ng g module nome --routing=true```

Generate componente em nova pasta selecionando o modulo:

```ng g component nome/nome --module=nome```





## APIs

ATUALIZAR PARA ultima versão do angular 9
npm i -- save @angular/animations@v9-lts @angular/common@v9-lts @angular/compiler@v9-lts @angular/core@v9-lts @angular/forms@v9-lts @angular/platform-browser@v9-lts @angular/platform-browser-dynamic@v9-lts @angular/router@v9-lts @angular/service-worker@v9-lts @angular/pwa@v9-lts

  Fonte:
    https://www.npmjs.com/package/nunito-fontface
    
  Para input:
  https://www.npmjs.com/package/ngx-material-file-input
   npm i ngx-material-file-input

   demo: https://merlosy.github.io/ngx-material-file-input/

  Outra opção não usada de input: 
  npm i angular-material-fileupload
  https://nishantmc.github.io/angular-material-fileupload.github.io/index.html
  https://www.npmjs.com/package/angular-material-fileupload


    API Firebase2 (BD)
    npm install @angular/fire firebase --save
    configurando o firebase:
    https://github.com/angular/angularfire2/blob/master/docs/install-and-setup.md
    Função snapshotChanges() realiza a atualização em realtime.
    //https://firebase.google.com/docs/firestore/query-data/listen
    multi where:
    https://firebase.google.com/docs/firestore/query-data/queries?hl=pt-PT

    FIREBASEUI
    npm install firebaseui-angular --save

    API Responsiva Material.io Angular
    npm i -s @angular/flex-layout @angular/cdk
    tamanho das telas
    https://github.com/angular/flex-layout/wiki/Responsive-API
    https://github.com/angular/flex-layout/blob/master/docs/documentation/fxLayoutAlign-API.md

    Add o material Designer no projeto:
    ng add @angular/material
    https://material.angular.io/guide/getting-started


    TIME PICKER
    utilizado
    		https://www.npmjs.com/package/ngx-material-timepicker
            erro do angular 8: https://gist.github.com/srukshan/163b07d9913df281bd34f6cea8eb2334

    IMPRESSÃO
    npm install --save pdfmake

    https://www.ngdevelop.tech/angular-8-export-to-pdf-using-pdfmake/

    http://pdfmake.org/playground.html
    https://www.ngdevelop.tech/insert-image-from-url-in-pdf-using-pdfmake/

    input
    https://merlosy.github.io/ngx-material-file-input/#multiple-files


    CORTADOR DE IMAGEM
    utilizado:

    https://www.npmjs.com/package/ngx-img-cropper

outra opção:
    https://www.npmjs.com/package/ngx-image-cropper


    Formbuilder array exemplo:
    https://pt.stackoverflow.com/questions/330652/form-builder-com-array-no-angular

gráfico:

https://valor-software.com/ng2-charts/#/LineChart

https://stackblitz.com/edit/ng2-charts-line-template?file=src%2Fapp%2Fapp.component.ts

## PWA
instalando (necessário excluir instalação anterior)
    sudo ng add @angular/pwa

https://medium.com/@lucashenriquedeabreu
https://lucashenriqueabreu.github.io/PWATodo/PWATodo/
https://github.com/brunocantisano/PWAExample/tree/master/angular/PWATodo

DOCUMENTAÇÃO ANGULAR
https://angular.io/guide/service-worker-intro

Projeto em pwa Angular7
https://github.com/jaisonpereira/poc-pwa

documentação do google 
https://developers.google.com/web/tools/lighthouse/audits/registered-service-worker?utm_source=lighthouse&utm_medium=devtools



## EXECUÇÃO
Executando no browser Linux: sudo ng serve

## Git

**EMPURRAR/COMMIT NO GIT**
Para add todas as alterações na lista de commit
    --PRIMEIRO
        git add *
        Montando o pacote de commit com comentário
        git commit -m "Comentário!" - feito pelo vc code
        ou
        confirma via VS code

    --SEGUNDO
        Puch empurrando para o Git
            git push https://github.com/Kleber2018/delivery-cliente-push.git master
        Vai pedir usuário e senha do Git

    
**BAIXAR/CLONAR DO GIT**
    git clone https://github.com/Kleber2018/dashboard.gi


**ALTERAR ORIGEM NO GIT**
    git remote set-url origin https://github.com/Kleber2018/delivery-cliente-push.git

**ALTERAR PARA O BRANCH**
    git branch teste master

**MANUAL:**
    https://rogerdudler.github.io/git-guide/index.pt_BR.html

## UPDATE V9 PARA V10

ng update @angular/cdk@10.2.7 @angular/cli@10.2.3 @angular/core@10.2.5 rxjs@6.6.7
 

Apagar package.lock e node module depois instalar novamente com

npm install

ng update @angular/cdk@latest @angular/cli@latest @angular/core@latest rxjs@latest
npm i @angular/flex-layout@latest @sentry/browser@latest @angular/pwa@latest
npm i @angular/pwa@latest ngx-mask@latest @angular/material@latest @angular/compiler@latest @angular/platform-browser@latest @angular/platform-browser-dynamic@latest
npm i @angular/router@latest @angular/platform-browser-dynamic@latest @angular/platform-browser@latest @angular/fire@latest firebase@latest @angular/forms@latest


 ## TEMPLATE


 https://adorable.io/
#ec505f

Avatar:
https://api.adorable.io/avatars/list
{"face":{"eyes":["eyes1","eyes10","eyes2","eyes3","eyes4","eyes5","eyes6","eyes7","eyes9"],"nose":["nose2","nose3","nose4","nose5","nose6","nose7","nose8","nose9"],"mouth":["mouth1","mouth10","mouth11","mouth3","mouth5","mouth6","mouth7","mouth9"]}}

 ## BUILD

Gerar o build
 sudo ng build

Para verificar se está executado (obrigatório estar dentro da pasta no dist/...)
  http-server

Deploy do build no firebase:
  firebase init
    configurando:
      Hosting (escolhe com barra espaço, Enter confirma)
      Escolhe o diretório public (dist/pasta)
      Sigle-page: y
      Overwite index.html: n
  ng build --prod && firebase deploy --only hosting:montabaco

