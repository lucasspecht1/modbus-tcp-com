"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

Object.defineProperty(exports, "__esModule", { value: true });

// Módulo para operações Modbus pós Conexão.
const jsmodbus_1 = require("jsmodbus");

// Módulo para estabelecer conexão com o socket.
const net_1 = require("net");

/** **Classe Responsavel por realizar operações do protocolo Modbus**
 *
 *  _Conecta-se ao equipamento utilizando socket e após conexão estabelecida,
 *  executa a leitura contida nos métodos_
 *
 *  @requires [jsmodbus](https://www.npmjs.com/package/jsmodbus)
 *
 *  @author [Lucas Specht](https://gitlab.com/lucasspecht1)
*/
module.exports = class Modbus {
    constructor(IP, PORT, unit_id = 1) {
        /** **Instancia Classe Socket**
         *
         *  @property
         *
         * _Utilizada para estabelecer conexão direta ao equipamento_
         */
        this.socket = new net_1.Socket();
        /** **Instancia Classe jsmodbus**
         *
         *  @property
         *
         *  _Utilizado para se comunicar com o equipamento a partir da conexão socket_
         */
        this.ClientModbus = new jsmodbus_1.ModbusTCPClient(this.socket);

        this.IP = IP;
        this.PORT = PORT;
    }

    /** **Método utilizado para organizar as etapas de comunicação e retornar os valores lidos**
     *
     *  @param callback - Função de leitura modbus, passada como parametro.
     *
     *  @returns Retorna uma Array com os valores lidos.
     */
    processModbus(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            // Encapsulamento das etapas de leitura em uma Promise.
            return new Promise((resolve, reject) => {
                // Se conecta com o equipamento por meio de socket.
                this.socket.connect({ host: this.IP, port: this.PORT });
                // Aguarda a estabelecimento da conexão e executa a leitura.
                this.socket.on('connect', () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        /* Executa a fução de leitura passada como parametro
                         e retorna os valores lidos.*/
                        resolve(yield callback());
                        this.socket.end();
                    }
                    catch (Error) {
                        reject(Error);
                        this.socket.end();
                    }
                }));
            });
        });
    }

    /** **Método leitura de registradores 'Coils'**
     *
     *  @param registrador - Endereço registrador a ser lido.
     *  @param quantidade - Quantidade de registradores a serem lidos.
     *  @default quantidade = 1.
     *
     *  @returns Retorna uma Array com os valores lidos.
     */
    readCoils(registrador_1) {
        return __awaiter(this, arguments, void 0, function* (
        /** **Endereço registrador a ser lido**
         *
         *  _Os valores são lidos a partir do registrador informado,
         *   Caso a quantidade informada seja 1, somente este registrador será lido_
         */
        registrador, 
        /** **Quantidade de registradores a serem lidos**
         *
         *  _Caso nenhum valor seja informado, somente o registrador informado será lido_
         *
         *  @default 1
         */
        quantidade = 1) {
            return yield this.processModbus(() => __awaiter(this, void 0, void 0, function* () { return (yield this.ClientModbus.readCoils(registrador, quantidade)).response.body.valuesAsArray; }));
        });
    }

    /** **Método leitura de registradores 'Discrete Inputs'**
     *
     *  @param registrador - Endereço registrador a ser lido.
     *  @param quantidade - Quantidade de registradores a serem lidos.
     *  @default quantidade = 1.
     *
     *  @returns Retorna uma Array com os valores lidos.
     */
    readDiscreteInputs(registrador_1) {
        return __awaiter(this, arguments, void 0, function* (
        /** **Endereço registrador a ser lido**
         *
         *  _Os valores são lidos a partir do registrador informado,
         *   Caso a quantidade informada seja 1, somente este registrador será lido_
         */
        registrador, 
        /** **Quantidade de registradores a serem lidos**
         *
         *  _Caso nenhum valor seja informado, somente o registrador informado será lido_
         *
         *  @default 1
         */
        quantidade = 1) {
            return yield this.processModbus(() => __awaiter(this, void 0, void 0, function* () { return (yield this.ClientModbus.readDiscreteInputs(registrador, quantidade)).response.body.valuesAsArray; }));
        });
    }

    /** **Método leitura de registradores 'Holding Registers'**
     *
     *  @param registrador - Endereço registrador a ser lido.
     *  @param quantidade - Quantidade de registradores a serem lidos.
     *  @default quantidade = 1.
     *
     *  @returns Retorna uma Array com os valores lidos.
     */
    readHoldingRegisters(registrador_1) {
        return __awaiter(this, arguments, void 0, function* (
        /** **Endereço registrador a ser lido**
         *
         *  _Os valores são lidos a partir do registrador informado,
         *   Caso a quantidade informada seja 1, somente este registrador será lido_
         */
        registrador, 
        /** **Quantidade de registradores a serem lidos**
         *
         *  _Caso nenhum valor seja informado, somente o registrador informado será lido_
         *
         *  @default 1
         */
        quantidade = 1) {
            return yield this.processModbus(() => __awaiter(this, void 0, void 0, function* () { return (yield this.ClientModbus.readHoldingRegisters(registrador, quantidade)).response.body.valuesAsArray; }));
        });
    }

    /** **Método leitura de registradores 'Input Registers'**
     *
     *  @param registrador - Endereço registrador a ser lido.
     *  @param quantidade - Quantidade de registradores a serem lidos.
     *  @default quantidade = 1.
     *
     *  @returns Retorna uma Array com os valores lidos.
     */
    readInputRegisters(registrador_1) {
        return __awaiter(this, arguments, void 0, function* (
        /** **Endereço registrador a ser lido**
         *
         *  _Os valores são lidos a partir do registrador informado,
         *   Caso a quantidade informada seja 1, somente este registrador será lido_
         */
        registrador, 
        /** **Quantidade de registradores a serem lidos**
         *
         *  _Caso nenhum valor seja informado, somente o registrador informado será lido_
         *
         *  @default 1
         */
        quantidade = 1) {
            return yield this.processModbus(() => __awaiter(this, void 0, void 0, function* () { return (yield this.ClientModbus.readInputRegisters(registrador, quantidade)).response.body.valuesAsArray; }));
        });
    }

    /** **Método escrita de registrador 'Single Coil'**
     *
     *  @param registrador - Endereço registrador a ser escrito.
     *  @param valor - Valor (boolean) a ser escrito.
     *
     *  @returns Retorna o valor escrito.
     */
    writeSingleCoil(
    /** **Endereço registrador a ser escrito** */
    registrador, 
    /** **Valor a ser escrito** */
    valor) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.processModbus(() => __awaiter(this, void 0, void 0, function* () { return (yield this.ClientModbus.writeSingleCoil(registrador, valor)).response.body.value; }));
        });
    }
    /** **Método escrita de registrador 'Single Register'**
     *
     *  @param registrador - Endereço registrador a ser escrito.
     *  @param valor - Valor a ser escrito no endereço.
     *
     *  @returns Retorna o valor escrito.
     */
    writeSingleRegister(
    /** **Endereço registrador a ser escrito** */
    registrador, 
    /** **Valor a ser escrito** */
    valor) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.processModbus(() => __awaiter(this, void 0, void 0, function* () { return (yield this.ClientModbus.writeSingleRegister(registrador, valor)).response.body.value; }));
        });
    }
    /** **Método escrita de registrador 'Multiple Coils'**
     *
     *  @param registrador - Endereço inicial dos registradores a seres escritos.
     *  @param valores - Valores (boolean[]) a serem escritos.
     *
     *  @returns Retorna a quantidade de registradores escritos.
     */
    writeMultipleCoils(
    /** **Endereço registrador a ser escrito** */
    registrador, 
    /** **Valores a serem escritos** */
    valores) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.processModbus(() => __awaiter(this, void 0, void 0, function* () { return (yield this.ClientModbus.writeMultipleCoils(registrador, valores)).response.bodyLength; }));
        });
    }

    /** **Método escrita de registrador 'Multiple Registers'**
     *
     *  @param registrador - Endereço inicial dos registradores a seres escritos.
     *  @param valores - Valores (number[]) a serem escritos.
     *
     *  @returns Retorna a quantidade de registradores escritos.
     */
    writeMultipleRegisters(
    /** **Endereço registrador a ser escrito** */
    registrador, 
    /** **Valores a serem escritos** */
    valores) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.processModbus(() => __awaiter(this, void 0, void 0, function* () { return (yield this.ClientModbus.writeMultipleRegisters(registrador, valores)).response.bodyLength; }));
        });
    }
}