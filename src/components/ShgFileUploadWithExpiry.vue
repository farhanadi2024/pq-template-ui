<template>
  <v-col :id="componentName" cols="12" :md="columnSize">
    <v-label v-if="label">
      {{ label }}
    </v-label>
    <br />

    <!-- when file exist, show this detail -->
    <div class="bg-grey-lighten-5 rounded-sm py-1" style="width: fit-content" v-if="fileDetail?._id">
      <v-row no-gutters justify="center" align="center">
        <v-col cols="auto">
          <v-row no-gutters justify="center" align="center" class="flex-nowrap">
            <v-col cols="auto">
              <div class="mx-1">
                <v-icon class="text-medium-emphasis">mdi-clock-time-four-outline</v-icon>
              </div>
            </v-col>
            <v-col cols="auto">
              <div class="text-subtitle-2 text-medium-emphasis">
                {{ moment(model![0]).format('DD MMM YYYY') }}
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto">
          <span class="mx-1"> | </span>
        </v-col>

        <v-col cols="auto">
          <button class="bg-blue-lighten-5 text-blue-darken-1 px-1 py-1 rounded-sm" type="button">
            <v-row no-gutters justify="center" align="center" class="flex-nowrap">
              <v-col>
                <div class="mx-1">
                  <v-icon class="">mdi-paperclip-check</v-icon>
                </div>
              </v-col>
              <v-col>
                <div class="text-subtitle-2">
                  {{ shortenFilename(fileDetail.filename) }}
                </div>
              </v-col>
            </v-row>
          </button>
        </v-col>

        <v-col cols="auto">
          <div class="mx-1" @click="handleUpdateExpiredDate">
            <button class="text-blue-darken-1 px-1 py-1 rounded-sm" type="button">
              <v-row no-gutters justify="center" align="center" class="flex-nowrap">
                <v-col>
                  <v-icon class="">mdi-fountain-pen</v-icon>
                </v-col>
              </v-row>
            </button>
          </div>
        </v-col>

        <v-col cols="auto">
          <div class="mx-1" @click="deleteDocument">
            <button class="bg-red-lighten-5 text-red-darken-1 px-1 py-1 rounded-sm" type="button">
              <v-row no-gutters justify="center" align="center" class="flex-nowrap">
                <v-col>
                  <v-icon class="">mdi-close-circle-outline</v-icon>
                </v-col>
              </v-row>
            </button>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- when no file, trigger upload modal -->
    <VeeField :name="name" v-model="model" :rules="validationRules" v-slot="{ errorMessage }">
      <BaseButton color="primary" @click="handleFileUpload" v-if="!fileDetail?._id">
        <template v-slot:default>
          <v-row no-gutters justify="center" align="center" class="flex-nowrap">
            <v-col>
              <div class="mx-1">
                <v-icon class="">mdi-paperclip-check</v-icon>
              </div>
            </v-col>
            <v-col>
              <div class="text-subtitle-2">Add File</div>
            </v-col>
          </v-row>
        </template>
      </BaseButton>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>
    </VeeField>
  </v-col>
</template>

<script setup lang="ts">
import { DefaultPropsData } from '@/constants/props.constant';
import { DocumentService } from '@/services/document.service';
import { shortenFilename } from '@/utils';
import { BaseButton, useInput } from 'erp-template-vuetify-components';
import moment from 'moment';
import { onMounted, ref } from 'vue';
import { openDialog } from 'vue3-promise-dialog';
import ShgFileUploadWithExpiryUpdate from './ShgFileUploadWithExpiryUpdate.vue';
import ShgFileUploadWithExpiryUpload from './ShgFileUploadWithExpiryUpload.vue';

const componentName = 'ShgFileUpload';
defineOptions({
  name: componentName,
});

// defineProps<{
//   name: string;
//   required: boolean;
//   label: string;
// }>();
// {
// //   name: string;
// //   required: boolean;
// //   label: string;
// // }

type Props = {
  name: string;
  required: boolean;
  label: string;
};

const props = withDefaults(defineProps<Props>(), {
  ...DefaultPropsData,
  maxFileSize: 2,
});

const { id, validationRules, columnSize } = useInput(componentName, props);

const model = defineModel<string[]>();
const fileDetail = ref<{ _id?: string; filename: string } | null>();

const handleFileUpload = async () => {
  type Response = {
    id: string;
    date: string;
    fileName: string;
  };

  const data = (await openDialog(ShgFileUploadWithExpiryUpload)) as Response | undefined;

  if (!data) {
    return;
  }

  model.value = [data.date, data.id];

  fileDetail.value = {
    filename: data.fileName,
    _id: data.id,
  };
};

const handleUpdateExpiredDate = async () => {
  type Response = {
    date: string;
  };

  const data = (await openDialog(ShgFileUploadWithExpiryUpdate, {
    fileId: fileDetail.value?._id,
    date: model.value![0],
  })) as Response | undefined;

  if (!data) {
    return;
  }

  model.value![0] = data.date;
};

const deleteDocument = async () => {
  const response = await DocumentService.deleteFile(fileDetail!.value!._id!);

  if (response.error) {
    console.log(response.error);
    return;
  }

  fileDetail.value = {
    filename: '',
    _id: undefined,
  };

  model.value = [];
};

const getDocument = async () => {
  if (!model.value?.[1]) {
    return;
  }

  const response = await DocumentService.getFile(model.value[1]);

  if (response.error) {
    console.log(response.error);
    return;
  }

  fileDetail.value = {
    filename: response.data.filename,
    _id: response.data._id,
  };

  model.value = [response.data.expired_at, response.data._id];
};

onMounted(async () => {
  getDocument();
});
</script>

<style scoped>
.error-message {
  color: #b34c5f;
  font-size: 12px;
  margin-top: 6px;
  margin-left: 16px;
}
</style>
