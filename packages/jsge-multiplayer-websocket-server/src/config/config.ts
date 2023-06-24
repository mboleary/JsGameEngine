import convict from "convict";
import {ipaddress} from 'convict-format-with-validator';

import schema from "./schema";
import { Config } from "./config.type";

const convictConfig = convict(schema);
convict.addFormat(ipaddress);

convictConfig.validate({allowed: 'strict'});

export const config: Config = convictConfig.getProperties();
