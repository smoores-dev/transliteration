{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/packages/
  packages = [ pkgs.git ];

  # https://devenv.sh/languages/
  languages.javascript = {
    enable = true;
    bun.enable = true;
  };

  # See full reference at https://devenv.sh/reference/options/
}
