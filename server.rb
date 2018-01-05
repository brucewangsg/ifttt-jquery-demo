require 'rubygems'
require 'sinatra'

set :public, File.dirname(__FILE__)
get '/' do
  File.read('index.html')
end