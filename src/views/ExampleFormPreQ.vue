<template>
  <ShgLayout :navigation-items="navigationItems">
    <template v-slot:contents="{ activeItemValue }">
      <ShgCard v-if="navigationItems[0].value === activeItemValue" :title="navigationItems[0].label">
        <ShgForm :columns="1" ref="generalForm">
          <ShgTextField v-model="generalData.firstName" label="First Name" :required="true" />
          <ShgTextField v-model="generalData.lastName" label="Last Name" :required="true" />
          <ShgTextField v-model="generalData.email" label="Email" :required="true" :rules="['email']" />
          <ShgTextarea v-model="generalData.address" label="Address" :required="true" />
        </ShgForm>

        <template v-slot:actions>
          <ShgButton type="submit" @click="submit"></ShgButton>
          <BaseButton color="success" @click="openTestDialog">Open Dialog</BaseButton>
        </template>
      </ShgCard>

      <ShgCard v-if="navigationItems[1].value === activeItemValue" :title="navigationItems[1].label">
        <ShgForm :columns="1" ref="userForm">
          <ShgTextField v-model="userData.username" label="Username" :required="true" />
          <ShgTextField v-model="userData.email" label="Email" :required="true" :rules="['email']" />
          <ShgPasswordField v-model="userData.password" label="Password" :required="true" :rules="['password']" />
          <ShgPasswordField
            v-model="userData.confirmPassword"
            label="Confirm Password"
            :required="true"
            :rules="['confirmed:@Password']"
          />
        </ShgForm>

        <template v-slot:options>
          <v-card>
            <v-card-title>Information</v-card-title>
            <v-card-text>Please insert with correct data</v-card-text>
          </v-card>
        </template>

        <template v-slot:actions>
          <BaseButton @click="register">Register</BaseButton>
        </template>
      </ShgCard>
    </template>
  </ShgLayout>
</template>

<script setup lang="ts">
import ShgTestDialog from '@/components/ShgTestDialog.vue';
import {
  BaseButton,
  ShgButton,
  ShgCard,
  ShgForm,
  ShgLayout,
  ShgPasswordField,
  ShgTextarea,
  ShgTextField,
  type LayoutNavigationItem,
  type ShgFormRef,
} from 'erp-template-vuetify-components';
import { ref } from 'vue';
import { openDialog } from 'vue3-promise-dialog';

const navigationItems = ref<LayoutNavigationItem[]>([
  { label: 'General', value: 'general' },
  { label: 'User', value: 'user' },
]);

const { generalForm, generalData, submit } = useGeneralForm();
const { userForm, userData, register } = useUserForm();

const openTestDialog = async () => {
  const result = await openDialog(ShgTestDialog, { email: 'test@gmail.com' });
  if (result) {
    alert('success submit dialog');
    console.log('result dialog', result);
  }
};

function useGeneralForm() {
  const generalForm = ref<ShgFormRef>();
  const generalData = ref({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
  });

  const submit = async () => {
    const isValid = await generalForm.value?.validate();
    if (isValid) {
      alert('Success Submit');
    }
  };

  return { generalForm, generalData, submit };
}

function useUserForm() {
  const userForm = ref<ShgFormRef>();
  const userData = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const register = async () => {
    const isValid = await userForm.value?.validate();
    if (isValid) {
      alert('Success Register');
    }
  };

  return { userForm, userData, register };
}
</script>
