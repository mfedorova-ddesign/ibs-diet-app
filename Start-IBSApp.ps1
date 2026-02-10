# Simple HTTP server for IBS Diet Helper (no Python/Node needed)
$Port = 9080
$Root = $PSScriptRoot
$Prefix = "http://localhost:$Port/"

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add($Prefix)
$Listener.Start()

$Mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css'
  '.js'   = 'application/javascript'
  '.json' = 'application/json'
}

Write-Host "IBS Diet Helper server running at $Prefix"
Write-Host "Press Ctrl+C to stop."
Write-Host ""

Start-Process $Prefix

while ($Listener.IsListening) {
  $Context = $Listener.GetContext()
  $Request = $Context.Request
  $Response = $Context.Response
  $Path = $Request.Url.LocalPath
  if ($Path -eq '/') { $Path = '/index.html' }
  $FilePath = Join-Path $Root ($Path.TrimStart('/'))
  if (Test-Path $FilePath -PathType Leaf) {
    $Ext = [System.IO.Path]::GetExtension($FilePath)
    $ContentType = $Mime[$Ext]
    if (-not $ContentType) { $ContentType = 'application/octet-stream' }
    $Response.ContentType = $ContentType
    $Response.StatusCode = 200
    if ($Ext -eq '.html') { $Response.AddHeader('Cache-Control', 'no-cache') }
    $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
    $Response.ContentLength64 = $Bytes.Length
    $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
  } else {
    $Response.StatusCode = 404
  }
  $Response.Close()
}
