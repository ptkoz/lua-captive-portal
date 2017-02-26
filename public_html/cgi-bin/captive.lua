--
-- Created by IntelliJ IDEA.
-- User: patryk
-- Date: 25.02.2017
-- Time: 00:17
-- To change this template use File | Settings | File Templates.
--
package.path = package.path .. ";../../vendor/?.lua;../../application/?.lua";
require "application".bootstrap("../../application").run();