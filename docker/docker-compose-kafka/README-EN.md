# Docker Compose - Simple Kafka

![]({{get_img_url('docker/docker-compose-kafka/assets/dash.png')}})

Hey folks! How’s it going? 😄  
I’m here to share a simple script I learned while working on a college project using **Kafka** and **Python**. Maybe later I’ll make another post showing how I connected everything and created the *consumers* and *producers* in Python.

The goal is to keep the setup as simple as possible, since most of the examples I found were a bit complex and included tools I didn’t actually need.

In this final version, I only kept **Zookeeper** (used by Kafka to coordinate services), **Kafka** itself, and a **dashboard** to easily visualize what’s going on — which helps *a lot*!  
You can access the dashboard through your browser at `localhost:8080`.


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


### 🧭 A Few Notes :exclamation:

- The **Kafka** service is exposed on port **29092**, so when connecting, use `localhost:29092`.  
- If you make any changes, check that all services are still connected properly.  
  For example: if you change Kafka’s port, you’ll also need to update it in both **kafka-ui** and **zookeeper**.


  And that’s all for today, folks! See you next time! 👋
