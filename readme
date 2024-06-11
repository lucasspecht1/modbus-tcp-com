Módulo para Comunicação a partir do protocolo Modbus (TCP) de forma facil e prática.


Modbus [![Build Status](https://travis-ci.org/Cloud-Automation/node-modbus.png)](https://travis-ci.org/Cloud-Automation/node-modbus)
========


💾 Status
------

Versão 0.1.0 é uma versão estável funcional.


🖥️ Exemplo Leitura 
---------------

```typescript

/* Importa a classe de operações Modbus */
import Modbus from "modbus-tcp-com";

/* Instancia do client Modbus.
   Classe contendo métodos de operação. */
const Client = new Modbus('localhost', 502)

/* Leitura do registrador no endereço 0.
   Retorna o valor de forma direta, 
   deve ser chamado em um método 'async'. */
await Client.readHoldingRegisters(0, 1); 
```

🖥️ Exemplo Escritura
---------------

```typescript

/* Importa a classe de operações Modbus */
import Modbus from "modbus-tcp-com";

/* Instancia do client Modbus.
   Classe contendo métodos de operação. */
const Client = new Modbus('localhost', 502)

// Escrita do valor '1' no registrador de endereço '0'
await Client.readHoldingRegisters(0, 1); 
```

🎯 Objetivo
------------
Este projeto tem como intuito o aprimoramento do módulo [jsmodbus](https://www.npmjs.com/package/jsmodbus)

- Facilitação das operações, sem necessidade de módulos externos ou injeções externas.
- Conexão e Desconexão automatica ao equipamento de destino.
- Funções de leitura, com acesso aos valores de forma direta a partir de um método da classe
- Funções de Escrita de forma direta ao endereços de registradores requeridos 


🛠️ Construído com
------------------
Lista de Módulos / Frameworks utilizados na construção do projeto:

* [jsmodbus](https://www.npmjs.com/package/jsmodbus)


## ✒️ Autores

Lucas Specht (https://gitlab.com/lucas_specht)
