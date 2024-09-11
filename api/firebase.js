const admin = require('firebase-admin');

const config = {
  credential: admin.credential.cert({

  "type": "service_account",
  "project_id": "driverapp-47cd8",
  "private_key_id": "d59665d390a61ef72e43149dcca2bfc626dfeca3",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDO/ExR1CV5GIfB\nkGOR1ICyT+PcyMZoR4R/DVctVzuDkuOb9HHFPNcK0b8dxZM/aRO6lVXYSH0gJS8Y\n6ZrozZbCSB9grAOkQQcPfEdjyBFQeBB6O+PD+2MhnJOGdcfZ3JgDf+vNqbZXtuuN\nUaDwRXOFs9jswHo5MJFKqpCpq0iuqCMn50UxcPcdz4qj1P52kOHAntBWJHLC5nte\ny7NdqodtlubWR9hQmbqhuLQnlXizt4p4azImfj5Z/8s+LW8+8edZcdI8Jzu+L93q\nSGEMzbrOayCwrVPsy0yBQie+pzOvjWLbRxziQGxk3Dm1DWjCYW11xQtgw5czmzef\nryBHASj3AgMBAAECggEAVZNjHGvJCG13ZzRCrl68zLwR+cy6lw+GfJ7v3YuUy/u1\nhduFFCZoxAze5riyfcN8SCaIxPCHZvxoofSnOrwRKgb2jhngMY8/E4xu2Za0beAN\n8/OB4huzqwhYx/03IOA+qye+vpt9i3tRnO5USzJzpiIqvAuCHNXzI/sr7zIlTSvw\nt9OBuZ1HKrbCRE3wElXRoaX3jjXcgrNGhqv8s2pWNwxn6Ab8ilDroF8//hnhN4Is\nM69p0hjbpw5K/WRn2F0LkKF+jr2d1Uiwf8qkYsrC+HBq5iq27+wveyPHRPoz7Fba\n2DmqxK+fggh7vxtWsUhI0Ub+qTgiC3E5nJACz39gSQKBgQD7Kg5KhgPAQAoOJcZQ\ngYDPW8k/11Rc+lqjrwJBCPwz6eXbHyb2lVWXzcl4F++JqTDGWU0uVwJolmis138F\nht+RpI/+G7iXUu7jEmK5uCEWP5W0vi8WVEDUxXT0tMBRSal5vdZGeTTpayd5NwFe\nKCtmPd8JdvuxAQ57FkQRSBFoyQKBgQDS+H49T3a/3jYiv9efQhupA+VrzCL2H1G9\nUU+U+4O21856Fpe6csWDfjMAi2GXyNqe0mqx/+YNcTj8vZmJBJZ54Hcq60o4Irm+\nCSmlGzqQfQU5xcKcTBc50nSf6AMPNulw0k4QYpHAqkHjoP1puW6xJ8W7xM2W1Ar+\nwqE5u+yjvwKBgCu1ZOlJKyvwuQ8/OaTW9KChW4N1qKPJma50jVLeCm3KXYrlf/VX\nhZ62XEI/ABuXyvopnknbMHsc+bhihCNlFlEVL03MazJCZ3oyv+WMCo4BoL7kffNH\n1ERy3Gidb/51cD3UcI6xFykr0aHBlcZZ/Tt8tuzBvQlPosJ+3HeZcBYpAoGBANGy\nJyBfvMPnZl3R28uzlPTBJ6enJ1UGOmP3zydhfEEgbl4R2Mx9Se9yX9V5tQ5+mTbm\nJSE6Hvtbf+5Psq1rfvozb5+ccZAsi/zk9Jzk3KhDbA9Jjy91vlw94KgUn/3ecdgv\nYWKN5xve31EXcutEYk76HmONsV/q8ebZpBFTxlnXAoGAJ9wdpOZr1chU8UR3qID6\nVwd/m6Ao9986j9k75iL4A7faUKYmcvHPE+0ryWIIu88KzSL1u0OQckCm7Tygc8y4\nnMJCDePKk/f27do5PvsFSN4M6cPbNOCIFxXVvwrPdMPUKsqkvSbtk8uZezylbUPm\nL4FqhQhL2/EUGO8mYeHjbsI=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-2tcx5@driverapp-47cd8.iam.gserviceaccount.com",
  "client_id": "112260600757664742064",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2tcx5%40driverapp-47cd8.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"

  }),
};

// Initialize Firebase Admin SDK
const firebase = admin.apps.length
  ? admin.app()
  : admin.initializeApp(config);

module.exports = { firebase };
