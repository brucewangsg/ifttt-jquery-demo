require 'rubygems'
require 'sinatra'

set :bind, '0.0.0.0'
set :public, File.dirname(__FILE__)
get '/' do
  File.read('index.html')
end