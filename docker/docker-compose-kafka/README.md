# Docker Compose - Kafka simples

![]({{get_img_url('docker/docker-compose-kafka/assets/dash.png')}})

Olá, meu pessoal bom de papo! Tudo bão? 😄  
Vim aqui compartilhar um script que aprendi enquanto fazia um trabalho da faculdade usando **Kafka** e **Python**. Quem sabe mais pra frente eu não faço outro artigo mostrando como conectei e criei os *consumers* e *producers* em Python?

A ideia é manter o script o mais simples possível, já que a maioria dos exemplos que encontrei eram um pouco complicados e traziam ferramentas das quais eu não precisava.

Na versão final deixei apenas o **Zookeeper** (usado pelo Kafka para coordenar os serviços), o **Kafka** em si e uma **dashboard** para visualizar o que está acontecendo — o que ajuda *muito*!  
A dashboard pode ser acessada pelo navegador em `localhost:8080`.


## 🐳 Docker Compose

```yaml
version: '3'
services:
  zookeeper:
      image: confluentinc/cp-zookeeper:latest
          environment:
                ZOOKEEPER_CLIENT_PORT: 2181
                      ZOOKEEPER_TICK_TIME: 2000
                          ports:
                                - 2181:2181
                                  
                                    kafka:
                                        image: confluentinc/cp-kafka:latest
                                            depends_on:
                                                  - zookeeper
                                                      ports:
                                                            - 29092:29092
                                                                environment:
                                                                      KAFKA_BROKER_ID: 1
                                                                            KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
                                                                                  KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092
                                                                                        KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
                                                                                              KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
                                                                                                    KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

                                                                                                      kafka-ui:
                                                                                                          image: provectuslabs/kafka-ui
                                                                                                              container_name: kafka-ui
                                                                                                                  ports:
                                                                                                                        - "8080:8080"
                                                                                                                            restart: always
                                                                                                                                environment:
                                                                                                                                      - KAFKA_CLUSTERS_0_NAME=local
                                                                                                                                            - KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka:9092
                                                                                                                                                  - KAFKA_CLUSTERS_0_ZOOKEEPER=zookeeper:2181
```


### 🧭 Algumas observações :exclamation:

- O **Kafka** está exposto na porta **29092**, então, ao conectar, use `localhost:29092`.  
- Se fizer alguma modificação, verifique se as conexões entre os serviços continuam funcionando.  
  Por exemplo: se mudar a porta do Kafka, será necessário atualizar o valor tanto no **kafka-ui** quanto no **zookeeper**.


  E por hoje é só, pessoal! Tchau! 👋
