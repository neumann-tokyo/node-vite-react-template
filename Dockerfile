FROM node:22

ARG USERNAME=alice

RUN apt-get update -qq && \
  apt-get install -y git vim less sudo curl && \
  useradd -r -m -s /bin/bash -d /home/$USERNAME -u 998 $USERNAME && \
  echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME && \
  chmod 0440 /etc/sudoers.d/$USERNAME && \
  mkdir -p /home/$USERNAME/web && \
  chown -R $USERNAME:$USERNAME /home/$USERNAME/web && \
  npm install -g @biomejs/biome pnpm

USER $USERNAME
WORKDIR /home/$USERNAME/web
COPY . /home/$USERNAME/web
RUN cat /home/$USERNAME/web/.devcontainer/.bashrc > /home/$USERNAME/.bashrc

CMD ["bash"]
