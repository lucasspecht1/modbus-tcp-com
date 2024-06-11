// Módulo para operações Modbus pós Conexão.
import { ReadHoldingRegistersResponseBody } from 'jsmodbus/dist/response';
import { ModbusTCPClient as modbus} from 'jsmodbus';
import { ModbusTCPResponse } from 'jsmodbus';

// Módulo para estabelecer conexão com o socket.
import { Socket } from 'net';

export type RespostaModbus = {
    dec: number;
    hex: string;
    bin: string;
}

/** **Classe Responsavel por realizar operações do protocolo Modbus** 
 *  
 *  _Conecta-se ao equipamento utilizando socket e após conexão estabelecida, 
 *  executa a leitura contida nos métodos_
 *  
 *  @requires [jsmodbus](https://www.npmjs.com/package/jsmodbus)
 * 
 *  @author [Lucas Specht](https://gitlab.com/lucasspecht1)
*/
export default class Modbus {

    /** **Ip utilizada para se conectar ao equipamento**
     * 
     *  @property
     */
    private IP: string;

    /** **Porta utilizada para se conectar ao equipamento**
     * 
     *  @property
     */
    private PORT: number;

    /** **Instancia Classe Socket**
     * 
     *  @property
     * 
     * _Utilizada para estabelecer conexão direta ao equipamento_
     */
    private socket: Socket = new Socket();

    /** **Instancia Classe jsmodbus**
     *  
     *  @property
     * 
     *  _Utilizado para se comunicar com o equipamento a partir da conexão socket_
     */
    private ClientModbus = new modbus(this.socket);

    constructor(IP: string, PORT: number) {
        this.IP = IP;
        this.PORT = PORT;
    }

    /** **Método utilizado para processar e criar o objeto de resposta**
     * 
     *  _Recebe como parametro a resposta modbus e retorna objeto contendo os parametros:_
     *  - dec - valor em decimal
     *  - hex - valor em hexadecimal
     *  - bin - valor em binário
     *  
     *  _Caso hajá mais de um registrador na resposta, os objetos são retornados em Array_
     *  
     *  @param read - Resposta do Modbus TCP
     * 
     *  @returns Retorna um objeto contendo os valores dec, hex e bin.
     */
    private async processResponseModbus(read: ModbusTCPResponse<ReadHoldingRegistersResponseBody>): Promise<RespostaModbus[]> {
        // Recebe o parametro 'Valores em Array'
        const values: number[] | Uint16Array = read.body.valuesAsArray;
        const valores: RespostaModbus[] = [];

        values.map((value) => valores.push({ dec: Number(value), 
                                             bin: value.toString(2).padStart(16, '0'), 
                                             hex: value.toString(16) }));
        return valores;
    }

    /** **Método utilizado para organizar as etapas de comunicação e retornar os valores lidos** 
     *  
     *  @param callback - Função de leitura modbus, passada como parametro.
     * 
     *  @returns Retorna uma Array com os valores lidos. 
     */
    private async processModbus(callback: () => Promise<ModbusTCPResponse<any>>): Promise<RespostaModbus[]> {

        // Encapsulamento das etapas de leitura em uma Promise.
        return new Promise((resolve, reject) => {

            // Se conecta com o equipamento por meio de socket.
            this.socket.connect({host: this.IP, port: this.PORT});

            // Aguarda a estabelecimento da conexão e executa a leitura.
            this.socket.on('connect', async () => {
                try {
                    /* Executa a fução de leitura passada como parametro 
                     e retorna os valores lidos.*/
                     resolve(await this.processResponseModbus(await callback()));
                } 

                catch (Error) {
                    reject(Error);
                }
            });
        });
    }

    /** **Método leitura de registradores 'Coils'** 
     *  
     *  _Retorna o registrador informado em forma de objeto, com os seguintes campos:_
     *  - dec - valor em decimal
     *  - hex - valor em hexadecimal
     *  - bin - valor em binário
     * 
     *  @param registrador - Endereço registrador a ser lido.
     *  @param quantidade - Quantidade de registradores a serem lidos.
     *  @default quantidade = 1.
     *  
     *  @returns um objeto com os valores lidos. 
     */
    public async readCoils(
        /** **Endereço registrador a ser lido** 
         * 
         *  _Os valores são lidos a partir do registrador informado,
         *   Caso a quantidade informada seja 1, somente este registrador será lido_
         */
        registrador: number, 

        /** **Quantidade de registradores a serem lidos**
         *  
         *  _Caso nenhum valor seja informado, somente o registrador informado será lido_
         *  
         *  @default 1
         */
        quantidade: number = 1): Promise<RespostaModbus[]> {

        return await this.processModbus(async () => (await this.ClientModbus.readCoils(registrador, quantidade)).response);
    }

    /** **Método leitura de registradores 'Discrete Inputs'** 
     *  
     *  _Retorna o registrador informado em forma de objeto, com os seguintes campos:_
     *  - dec - valor em decimal
     *  - hex - valor em hexadecimal
     *  - bin - valor em binário
     * 
     *  @param registrador - Endereço registrador a ser lido.
     *  @param quantidade - Quantidade de registradores a serem lidos.
     *  @default quantidade = 1.
     *  
     *  @returns um objeto com os valores lidos. 
     */
    public async readDiscreteInputs(
        /** **Endereço registrador a ser lido** 
         * 
         *  _Os valores são lidos a partir do registrador informado,
         *   Caso a quantidade informada seja 1, somente este registrador será lido_
         */
        registrador: number, 

        /** **Quantidade de registradores a serem lidos**
         *  
         *  _Caso nenhum valor seja informado, somente o registrador informado será lido_
         *  
         *  @default 1
         */
        quantidade: number = 1): Promise<RespostaModbus[]> {

        return await this.processModbus(async () => (await this.ClientModbus.readDiscreteInputs(registrador, quantidade)).response);
    }

    /** **Método leitura de registradores 'Holding Registers'** 
     *  
     *  _Retorna o registrador informado em forma de objeto, com os seguintes campos:_
     *  - dec - valor em decimal
     *  - hex - valor em hexadecimal
     *  - bin - valor em binário
     *  
     *  @param registrador - Endereço registrador a ser lido.
     *  @param quantidade - Quantidade de registradores a serem lidos.
     *  @default quantidade = 1.
     * 
     *  
     *  @returns um objeto com os valores lidos.
     * 
     */
    public async readHoldingRegisters(
        /** **Endereço registrador a ser lido** 
         * 
         *  _Os valores são lidos a partir do registrador informado,
         *   Caso a quantidade informada seja 1, somente este registrador será lido_
         */
        registrador: number, 

        /** **Quantidade de registradores a serem lidos**
         *  
         *  _Caso nenhum valor seja informado, somente o registrador informado será lido_
         *  
         *  @default 1
         */
        quantidade: number = 1): Promise<RespostaModbus[]> {

        return await this.processModbus(async () => (await this.ClientModbus.readHoldingRegisters(registrador, quantidade)).response);
    }

    /** **Método leitura de registradores 'Input Registers'** 
     *  
     *  _Retorna o registrador informado em forma de objeto, com os seguintes campos:_
     *  - dec - valor em decimal
     *  - hex - valor em hexadecimal
     *  - bin - valor em binário
     * 
     *  @param registrador - Endereço registrador a ser lido.
     *  @param quantidade - Quantidade de registradores a serem lidos.
     *  @default quantidade = 1.
     *  
     *  @returns um objeto com os valores lidos. 
     */
    public async readInputRegisters(
        /** **Endereço registrador a ser lido** 
         * 
         *  _Os valores são lidos a partir do registrador informado,
         *   Caso a quantidade informada seja 1, somente este registrador será lido_
         */
        registrador: number, 

        /** **Quantidade de registradores a serem lidos**
         *  
         *  _Caso nenhum valor seja informado, somente o registrador informado será lido_
         *  
         *  @default 1
         */
        quantidade: number = 1): Promise<RespostaModbus[]> {

        return await this.processModbus(async () => (await this.ClientModbus.readInputRegisters(registrador, quantidade)).response);
    }

    /** **Método escrita de registrador 'Single Coil'** 
     *  
     *  @param registrador - Endereço registrador a ser escrito.
     *  @param valor - Valor (boolean) a ser escrito.
     *  
     *  @returns Retorna o valor escrito. 
     */
    public async writeSingleCoil(
        /** **Endereço registrador a ser escrito** */ 
        registrador: number,

        /** **Valor a ser escrito** */
        valor: boolean): Promise<void> {
    
        await this.processModbus(async () => (await this.ClientModbus.writeSingleCoil(registrador, valor)).response);
    }

    /** **Método escrita de registrador 'Single Register'** 
     *  
     *  @param registrador - Endereço registrador a ser escrito.
     *  @param valor - Valor a ser escrito no endereço.
     *  
     *  @returns Retorna o valor escrito. 
     */
    public async writeSingleRegister(
        /** **Endereço registrador a ser escrito** */ 
        registrador: number,

        /** **Valor a ser escrito** */
        valor: number): Promise<void> {
    
        await this.processModbus(async () => (await this.ClientModbus.writeSingleRegister(registrador, valor)).response);
    }

    /** **Método escrita de registrador 'Multiple Coils'** 
     *  
     *  @param registrador - Endereço inicial dos registradores a seres escritos.
     *  @param valores - Valores (boolean[]) a serem escritos.
     *  
     *  @returns Retorna a quantidade de registradores escritos. 
     */
    public async writeMultipleCoils(
        /** **Endereço registrador a ser escrito** */ 
        registrador: number,

        /** **Valores a serem escritos** */
        valores: boolean[]): Promise<void> {
    
        await this.processModbus(async () => (await this.ClientModbus.writeMultipleCoils(registrador, valores)).response);
    }

    /** **Método escrita de registrador 'Multiple Registers'** 
     *  
     *  @param registrador - Endereço inicial dos registradores a seres escritos.
     *  @param valores - Valores (number[]) a serem escritos.
     *  
     *  @returns Retorna a quantidade de registradores escritos. 
     */
    public async writeMultipleRegisters(
        /** **Endereço registrador a ser escrito** */ 
        registrador: number,

        /** **Valores a serem escritos** */
        valores: Buffer | number[]): Promise<void> {
    
        await this.processModbus(async () => (await this.ClientModbus.writeMultipleRegisters(registrador, valores)).response);
    }
}
