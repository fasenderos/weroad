<template>
  <div class="border-gray-200 left-0 top-0 z-40 w-full border-b bg-white transition-all duration-300 fixed">
    <nav class="relative w-full">
      <div class="flex w-full flex-col items-center justify-between md:h-16 md:flex-row">
        <div class="w-full grow md:w-auto">
          <slot />
        </div>
      </div>
    </nav>
  </div>
</template>
