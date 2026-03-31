# StoreCrafts Frontend File Migration Script
# This script migrates files from flat structure to new route groups structure

# Ensure we're in the frontend directory
if (-not (Test-Path "app")) {
    Write-Error "Please run this script from StoreCrafts-Frontend directory"
    exit 1
}

Write-Host "Starting StoreCrafts Frontend File Migration..." -ForegroundColor Green

# Helper functions
function Copy-DirectoryStructure {
    param(
        [string]$Source,
        [string]$Destination
    )
    
    if (Test-Path $Source) {
        Write-Host "Moving: $Source -> $Destination" -ForegroundColor Cyan
        
        # Create destination parent if needed
        $DestParent = Split-Path -Parent $Destination
        if (-not (Test-Path $DestParent)) {
            New-Item -ItemType Directory -Path $DestParent -Force | Out-Null
        }
        
        # Copy all contents
        Copy-Item -Path "$Source/*" -Destination $Destination -Recurse -Force
        Write-Host "[OK] Moved successfully" -ForegroundColor Green
    } else {
        Write-Host "[SKIP] Source not found: $Source" -ForegroundColor Yellow
    }
}

# STEP 1: Move Marketing Pages
Write-Host "`n=== STEP 1: Marketing Pages ===" -ForegroundColor Magenta
if (Test-Path "app/page.tsx") {
    Copy-Item -Path "app/page.tsx" -Destination "app/(marketing)/page.tsx" -Force
    Write-Host "[OK] Moved page.tsx to (marketing)/page.tsx" -ForegroundColor Green
}

# STEP 2: Move Super Admin Pages
Write-Host "`n=== STEP 2: Super Admin Pages ===" -ForegroundColor Magenta
Copy-DirectoryStructure -Source "app/superadmin/dashboard" -Destination "app/(superadmin)/dashboard"
Copy-DirectoryStructure -Source "app/superadmin/stores" -Destination "app/(superadmin)/stores"
Copy-DirectoryStructure -Source "app/superadmin/users" -Destination "app/(superadmin)/users"
if (Test-Path "app/superadmin/page.tsx") {
    Copy-Item -Path "app/superadmin/page.tsx" -Destination "app/(superadmin)/page.tsx" -Force
    Write-Host "[OK] Moved superadmin/page.tsx to (superadmin)/page.tsx" -ForegroundColor Green
}

# STEP 3: Move Store Admin Pages (requires code update later)
Write-Host "`n=== STEP 3: Store Admin Pages ===" -ForegroundColor Magenta
$adminSubdirs = @("catalog", "coupons", "dashboard", "orders", "profile", "reviews", "store-content", "users")
foreach ($dir in $adminSubdirs) {
    Copy-DirectoryStructure -Source "app/admin/$dir" -Destination "app/(storeadmin)/[storename]/$dir"
}
if (Test-Path "app/admin/page.tsx") {
    Copy-Item -Path "app/admin/page.tsx" -Destination "app/(storeadmin)/[storename]/page.tsx" -Force
    Write-Host "[OK] Moved admin/page.tsx to (storeadmin)/[storename]/page.tsx" -ForegroundColor Green
}
if (Test-Path "app/admin/layout.tsx") {
    Copy-Item -Path "app/admin/layout.tsx" -Destination "app/(storeadmin)/[storename]/admin-layout-backup.tsx" -Force
    Write-Host "[OK] Backed up admin/layout.tsx (needs manual review)" -ForegroundColor Green
}

# STEP 4: Move Storefront Pages
Write-Host "`n=== STEP 4: Storefront Pages ===" -ForegroundColor Magenta
Copy-DirectoryStructure -Source "app/shop" -Destination "app/(storefront)/[storename]"
Copy-DirectoryStructure -Source "app/cart" -Destination "app/(storefront)/[storename]/cart"
Copy-DirectoryStructure -Source "app/checkout" -Destination "app/(storefront)/[storename]/checkout"
Copy-DirectoryStructure -Source "app/orders" -Destination "app/(storefront)/[storename]/orders"
Copy-DirectoryStructure -Source "app/policies" -Destination "app/(storefront)/[storename]/policies"

Write-Host "[OK] Moved storefront pages" -ForegroundColor Green

# STEP 5: Move Auth Pages
Write-Host "`n=== STEP 5: Auth Pages ===" -ForegroundColor Magenta
Copy-DirectoryStructure -Source "app/login" -Destination "app/(auth)/login"
Copy-DirectoryStructure -Source "app/forgot-password" -Destination "app/(auth)/forgot-password"

Write-Host "[OK] Moved auth pages" -ForegroundColor Green

# STEP 6: Summary
Write-Host "`n=== MIGRATION COMPLETE ===" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Review ROUTE_GROUPS_MIGRATION.md for detailed expectations"
Write-Host "2. Update component imports in moved files (especially storeadmin and storefront)"
Write-Host "3. Add useStoreContext hook to storeadmin and storefront components"
Write-Host "4. Update API calls to include store_slug parameter"
Write-Host "5. Test routing with different URLs"
Write-Host "6. Delete old directories when confident"
Write-Host "`nOld directories to delete (when ready):" -ForegroundColor Cyan
@("app/admin", "app/superadmin", "app/shop", "app/cart", "app/checkout", "app/login", "app/forgot-password", "app/orders", "app/policies") | ForEach-Object {
    Write-Host "  - $_"
}

Write-Host "`nMigration script complete!`n" -ForegroundColor Green
