/**
 * Nothing to export in this file
 */

import { setup } from './setup';
import { Command, Direction, isDirection } from './common';

/**
 * Parse gesture descriptor to a direction list.
 */
function parseCommand(gesture = ''): Command {
  const commands: Direction[] = [];
  for (let i = 0; i < gesture.length; i++) {
    // Convert character to direction code.
    const c = gesture.charAt(i);
    if (isDirection(c)) {
      commands.push(c);
    } else {
      throw new Error(`Invalid gesture descriptor "${gesture}"`);
    }
  }
  return commands;
}

const toggleCookie = (flag: string) => {
  const re = new RegExp(`(^|;\\s*)${flag}=true(?=;|$)`);
  if (re.test(document.cookie)) {
    document.cookie = `${flag}=false; Path=/; Max-Age=0`;
  } else {
    document.cookie = `${flag}=true; Path=/`;
  }
};

const { currentScript } = document;

const MIN_COMMAND_LENGTH = 4;

if (currentScript) {
  // Read configuration the from hash of the script URL.
  const src = currentScript.getAttribute('src') || '';
  const hash = src.replace(/.*?#/, '');
  if (!hash) throw new Error('The config string `${flag}:${gesture}" must be set in URL hash');
  const arr = hash.split(':');

  // Parse and confirm arguments.
  const flag = arr[0];
  if (!flag || !/^\w+$/.test(flag)) throw new Error(`Invalid flag "${flag}"`);
  const command = parseCommand(arr[1]);
  if (command.length < MIN_COMMAND_LENGTH)
    throw new Error(`The length of gesture descriptor cannot be less than ${MIN_COMMAND_LENGTH}`);

  setup(command, () => {
    toggleCookie(flag);
    window.location.reload();
  });
}
