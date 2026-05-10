const { parse } = require('pg-connection-string');
const url = 'postgresql://postgres.kbuaxipcmexwsqpngpqx:[Pagina123.,
]@aws-1 - us - east - 1.pooler.supabase.com: 5432 / postgres';
const config = parse(url);
console.log(config);
