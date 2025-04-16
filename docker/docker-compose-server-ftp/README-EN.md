# Docker Compose - FTP Server

Hello everyone! I'm here to share another `docker-compose` script I put together to save some files at home,
using an old PC I had lying around.  
So, if you've got a little unused PC and want to use it for backups or to store files — 
without filling up the disk on your main computer or relying on the internet — I think this could be a great option!

I used **ProFTPD**, which was the easiest and simplest FTP service I found.  
I also tested **vsftpd**, but I found it a bit more complex to set up.

```yaml
services:
  ftp-container:
    image: kibatic/proftpd
    network_mode: host
    restart: always
    environment:
      FTP_LIST: "username:password"
      USERADD_OPTIONS: "-o --gid 33 --uid 33"
    volumes:
      - "./files:/home/data"

```

Now I'll explain some of the configurations you might want to tweak for your own setup:

- **network_mode —** This option makes the container use the same network as the host machine
(the PC running the FTP server).
That way, the service becomes visible on your local network — so you can access it from your phone or any other device connected to the same network.

- **FTP_LIST —** Here you set the username and password in the format username:password.
You can add more users by separating them with ;.

        Note: The password cannot contain special characters.

- **USERADD_OPTIONS —** Sets the group and default user inside the container.
With this setup, it can create and read files normally.

- **volumes —** The first path (./files) is the folder on your computer that will be shared with the FTP.
That’s where your files will be saved. I recommend creating an empty folder named files in the same directory as the script.
The second path (/home/data) is the directory inside the container — this name can be anything you like.
The important part is making sure the first path is correct.

That's it! Hope it helps. If you have any questions, feel free to reach out. See you next time! 👋
