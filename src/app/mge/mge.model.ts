export interface Mge {
  uid?: string;
  usuario?: any;
  OSE?: {
    periodo?: string; // 09/20
    data_execucao?: any;
    hora_inic?: any;
    hora_fim?: any;
    gerencia?: string; // GRTB
    localidade?: string; // Carambeí
    loc?: string;
    unidade?: string; // eet-01
    processo?: string; // painel
    pese?: string; // 00EL001
    ose?: string;
    equipe?: string;
    descricao?: string;
    data?: any; // data programado
    prazo?: any; // data prazo
    responsavel?: string;
    qtd_equipamentos?: number;
  };
  MGE?: {
      equipamentos?: [{
        ordem: string; //cmb-01, cmb-02
        identificacao: string; // patrimônio
        corrente?: any; // amperes
        horimetro:any; // funcionamento
        temperatura?: any;
        t?: any;
        a?: any;
        h?: any;
        q?:any;
      }];
      vazao?: any;
      pressao?: any;
      tensao?: any;
      obs?: string;
  };
  hora?: {
    inic?: string;
    fim?: string;
  };
  status?: string; // 1-pendente, 7-executada, 3-cancelado
  img?: [string];
  updatedAt?: any;
  createdAt?: any;
}
