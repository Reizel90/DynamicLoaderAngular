param (
    [string]$Path = ".",
    [string[]]$ExcludeDirs = @("node_modules", ".git", "dist", "bin", "obj", ".angular", ".vscode")
)

function Show-Tree {
    param (
        [string]$CurrentPath,
        [string]$Indent = ""
    )

    $items = Get-ChildItem -LiteralPath $CurrentPath
    foreach ($item in $items) {
        if ($item.PSIsContainer) {
            if ($ExcludeDirs -notcontains $item.Name) {
                Write-Host "$Indent+-- $($item.Name)"
                Show-Tree -CurrentPath $item.FullName -Indent "$Indent|   "
            }
        } else {
            Write-Host "$Indent|   $($item.Name)"
        }
    }
}

Write-Host "+-- $Path"
Show-Tree -CurrentPath $Path -Indent "|   "
