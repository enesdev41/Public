module.exports = {
    apps: [
      {
        name: "Moderation",
        namespace: "Ramal",
        script: 'main.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "1G",
        cwd: "./Bots/Main/Moderation",
      },
      {
        name: "Stats",
        namespace: "Ramal",
        script: 'main.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "1G",
        cwd: "./Bots/Main/Stats",
      },
      {
        name: "Register",
        namespace: "Ramal",
        script: 'main.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "1G",
        cwd: "./Bots/Main/Register",
      },
    /*{
        name: "Guards",
        namespace: "Ramal",
        script: 'main.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "1G",
        cwd: "./Bots/Guard",
      },*/
    ]
  };