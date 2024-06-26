<template>
    <div>
      <div class="bg-gray-50 pb-20">
        <slot name="navigation">
          <Topnav position="fixed">
            <div class="flex h-16 w-full items-center gap-x-4">
              <NuxtLink to="/" class="flex items-center justify-center">
                <Logo class="px-4" />
              </NuxtLink>
            </div>
          </Topnav>
        </slot>
        <div class="bg-gray-50 relative min-h-screen w-full overflow-x-hidden">
          <div class="w-full">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </template>
  